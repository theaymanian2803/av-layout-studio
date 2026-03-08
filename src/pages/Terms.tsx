import { motion } from "framer-motion";

const Terms = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using CineGear ("the Website"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Use of the Website</h2>
          <p className="text-muted-foreground mb-4">You agree to use the Website only for lawful purposes and in a way that does not:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Infringe the rights of others</li>
            <li>Restrict or inhibit anyone else's use of the Website</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Transmit any harmful, offensive, or illegal content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Products and Pricing</h2>
          <p className="text-muted-foreground">
            We strive to provide accurate product descriptions and pricing. However, errors may occur. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or update information at any time without prior notice. In the event of a pricing error, we may cancel orders placed at the incorrect price.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Orders and Payment</h2>
          <p className="text-muted-foreground">
            By placing an order, you warrant that you are at least 18 years old and have the legal authority to enter into a binding contract. All payments are processed securely through our third-party payment providers. We reserve the right to refuse or cancel any order for any reason.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
          <p className="text-muted-foreground">
            Shipping times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or circumstances beyond our control. Risk of loss and title for items pass to you upon delivery to the carrier.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
          <p className="text-muted-foreground">
            Please refer to our Shipping & Returns page for detailed information about our return policy. Certain items may not be eligible for return. Refunds will be processed to the original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content on this Website, including text, graphics, logos, images, and software, is the property of CineGear or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the fullest extent permitted by law, CineGear shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Website or any products purchased through it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Website constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these Terms of Service, please contact us at legal@cinegear.com.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
