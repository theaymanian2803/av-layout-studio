import { Cookie } from "lucide-react";
import { motion } from "framer-motion";

const Cookies = () => (
  <div className="min-h-screen py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Cookie className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
          <p className="text-muted-foreground mb-4">We use cookies for the following purposes:</p>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Essential Cookies</h3>
              <p className="text-sm text-muted-foreground">Required for the website to function properly. They enable core functionality such as security, account authentication, and shopping cart management.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Analytics Cookies</h3>
              <p className="text-sm text-muted-foreground">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Functional Cookies</h3>
              <p className="text-sm text-muted-foreground">Enable enhanced functionality and personalization, such as remembering your preferences and settings.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Marketing Cookies</h3>
              <p className="text-sm text-muted-foreground">Used to track visitors across websites to display relevant advertisements. These are only set with your consent.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
          <p className="text-muted-foreground">
            Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "Options" or "Preferences" menu of your browser. Please note that disabling certain cookies may affect the functionality of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
          <p className="text-muted-foreground">
            Some cookies are placed by third-party services that appear on our pages. We do not control the use of these cookies and cannot access them. The third-party service providers are responsible for the cookies they set on our site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about our use of cookies, please contact us at privacy@cinegear.com.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Cookies;
