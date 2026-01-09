import { Layout } from '@/components/layout/Layout';
import { Shield } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

const Privacy = () => {
  return (
    <Layout>
      <PageMeta
        title="Privacy Policy | Elevated AI Works"
        description="We collect information you provide directly to us, such as when you fill out a contact form, request a consultation, or communicate with us via email."
        canonicalPath="/privacy"
      />
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            <div className="prose prose-lg prose-invert max-w-none space-y-6 text-muted-foreground">
              <h2 className="font-display text-2xl font-bold text-foreground">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you fill out a contact form, request a consultation, or communicate with us via email. This may include your name, email address, business name, and any other information you choose to provide.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to your inquiries and provide requested services</li>
                <li>Send you project updates and relevant communications</li>
                <li>Improve our services and website experience</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground">Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our business, provided they agree to keep this information confidential.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Cookies & Analytics</h2>
              <p>
                Our website may use cookies and similar technologies to improve your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at hello@elevatedaiworks.com.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at hello@elevatedaiworks.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
