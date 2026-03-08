import { motion } from "framer-motion";

const Privacy = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">We collect information you provide directly to us, such as:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Name, email address, and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely via third-party providers)</li>
            <li>Order history and preferences</li>
            <li>Communications with our support team</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
          <p className="text-muted-foreground">
            We implement industry-standard security measures to protect your personal information. All sensitive data is encrypted using SSL technology. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at privacy@cinegear.com or through our Contact Us page.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacy;
