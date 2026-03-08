import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID")!;
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
const PAYPAL_BASE = "https://api-m.sandbox.paypal.com"; // Change to https://api-m.paypal.com for production

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get PayPal access token");
  return data.access_token;
}

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

    const userId = claimsData.claims.sub as string;
    const { action, order_id, amount, currency = "USD", return_url, cancel_url } = await req.json();
    const accessToken = await getAccessToken();

    if (action === "create-order") {
      const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: String(Number(amount).toFixed(2)),
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                return_url: return_url || "https://example.com/checkout?paypal=success",
                cancel_url: cancel_url || "https://example.com/checkout?paypal=cancel",
                user_action: "PAY_NOW",
                brand_name: "AVStore",
              },
            },
          },
        }),
      });
      const data = await res.json();

      // Extract approval URL
      const approveLink = data.links?.find((l: any) => l.rel === "approve" || l.rel === "payer-action");

      return jsonResponse({
        id: data.id,
        status: data.status,
        approve_url: approveLink?.href || null,
        raw: data,
      });
    }

    if (action === "capture-order") {
      if (!order_id) {
        return jsonResponse({ error: "order_id is required" }, 400);
      }
      const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${order_id}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return jsonResponse({
        id: data.id,
        status: data.status,
        raw: data,
      });
    }

    return jsonResponse({ error: "Invalid action. Use 'create-order' or 'capture-order'" }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
});
