import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return jsonResponse({ error: "RESEND_API_KEY is not configured" }, 500);
    }

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { order_id } = await req.json();
    if (!order_id) {
      return jsonResponse({ error: "order_id is required" }, 400);
    }

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return jsonResponse({ error: "Order not found" }, 404);
    }

    // Fetch order items with product details
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*, products(name, image, brand)")
      .eq("order_id", order_id);

    // Get user email
    const userId = claimsData.claims.sub as string;
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    
    // Fallback: get email from claims
    const userEmail = userData?.user?.email || (claimsData.claims.email as string);
    if (!userEmail) {
      return jsonResponse({ error: "Could not determine user email" }, 400);
    }

    const shipping = order.shipping_address as Record<string, string> | null;
    const paymentMethod = shipping?.payment_method === "cod" ? "Cash on Delivery" : "PayPal";
    const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    // Build items HTML
    const itemsHtml = (orderItems || []).map((item: any) => {
      const product = item.products;
      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="${product?.image || ""}" alt="${product?.name || item.product_id}" width="60" height="60" style="border-radius: 8px; object-fit: cover;" />
              <div>
                <p style="margin: 0; font-weight: 600; color: #1a1a1a;">${product?.name || item.product_id}</p>
                <p style="margin: 2px 0 0; font-size: 13px; color: #666;">${product?.brand || ""}</p>
              </div>
            </div>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center; color: #666;">×${item.quantity}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #1a1a1a;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`;
    }).join("");

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px 16px 0 0; padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Order Confirmed! 🎉</h1>
          <p style="margin: 8px 0 0; color: #a0aec0; font-size: 15px;">Thank you for your purchase</p>
        </div>

        <!-- Content -->
        <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Order Info -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
              <tr>
                <td style="color: #666; padding: 4px 0;">Order ID</td>
                <td style="text-align: right; font-weight: 600; color: #1a1a1a; font-family: monospace;">${order_id.slice(0, 8)}…</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 4px 0;">Date</td>
                <td style="text-align: right; font-weight: 600; color: #1a1a1a;">${orderDate}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 4px 0;">Payment</td>
                <td style="text-align: right; font-weight: 600; color: #1a1a1a;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 4px 0;">Status</td>
                <td style="text-align: right;">
                  <span style="background: #dcfce7; color: #166534; padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${order.status === "paid" ? "Paid" : order.status === "pending_cod" ? "Pending (COD)" : order.status}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Items -->
          <h3 style="margin: 0 0 16px; font-size: 16px; color: #1a1a1a;">Items Ordered</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
            ${itemsHtml}
          </table>

          <!-- Total -->
          <div style="margin-top: 20px; padding-top: 16px; border-top: 2px solid #1a1a2e;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
              <tr>
                <td style="color: #666;">Shipping</td>
                <td style="text-align: right; color: #166534; font-weight: 600;">Free</td>
              </tr>
              <tr>
                <td style="padding-top: 8px; font-size: 18px; font-weight: 700; color: #1a1a1a;">Total</td>
                <td style="padding-top: 8px; text-align: right; font-size: 18px; font-weight: 700; color: #1a1a2e;">$${Number(order.total).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          ${shipping ? `
          <!-- Shipping Address -->
          <div style="margin-top: 28px; background: #f8fafc; border-radius: 12px; padding: 20px;">
            <h4 style="margin: 0 0 8px; font-size: 14px; color: #666;">Shipping To</h4>
            <p style="margin: 0; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
              ${shipping.fname || ""} ${shipping.lname || ""}<br/>
              ${shipping.address || ""}<br/>
              ${shipping.city || ""}, ${shipping.state || ""} ${shipping.zip || ""}
            </p>
          </div>` : ""}

          <!-- CTA -->
          <div style="text-align: center; margin-top: 32px;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", ".lovable.app") || "#"}/account" 
               style="display: inline-block; background: #1a1a2e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 14px;">
              View Your Orders
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
          <p style="margin: 0;">AVStore — Your trusted camera & audio gear store</p>
          <p style="margin: 4px 0 0;">This is an automated confirmation. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>`;

    // Send via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AVStore <orders@yourdomain.com>",
        to: [userEmail],
        subject: `Order Confirmed — #${order_id.slice(0, 8)}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return jsonResponse({ error: "Failed to send email", details: resendData }, 500);
    }

    return jsonResponse({ success: true, email_id: resendData.id });
  } catch (err: any) {
    console.error("Email function error:", err);
    return jsonResponse({ error: err.message }, 500);
  }
});
