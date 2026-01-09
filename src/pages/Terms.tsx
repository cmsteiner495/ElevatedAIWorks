import { Layout } from '@/components/layout/Layout';
import { ScrollText } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

const Terms = () => {
  return (
    <Layout>
      <PageMeta
        title="Terms of Service | Elevated AI Works"
        description="By accessing our website or using our services, you agree to be bound by these Terms of Service."
        canonicalPath="/terms"
      />
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <ScrollText className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            <div className="prose prose-lg prose-invert max-w-none space-y-6 text-muted-foreground">
              <h2 className="font-display text-2xl font-bold text-foreground">Agreement to Terms</h2>
              <p>
                By accessing our website or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Services</h2>
              <p>
                Elevated AI Works provides branding, web design, business systems, and AI-powered tools for businesses. Specific deliverables, timelines, and pricing will be outlined in individual project proposals and agreements.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Intellectual Property</h2>
              <p>
                Upon full payment, clients receive full rights to the final deliverables created specifically for their project. We retain the right to display work in our portfolio unless otherwise agreed upon.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Client Responsibilities</h2>
              <p>Clients are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing accurate and timely project information</li>
                <li>Reviewing and providing feedback within agreed timeframes</li>
                <li>Making payments according to the agreed schedule</li>
                <li>Ensuring they have rights to any content they provide</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground">Payment Terms</h2>
              <p>
                Payment terms will be specified in individual project proposals. Typically, we require a deposit before beginning work, with remaining payments tied to project milestones.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Limitation of Liability</h2>
              <p>
                Elevated AI Works shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify clients of significant changes via email.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Contact</h2>
              <p>
                Questions about these Terms of Service should be sent to hello@elevatedaiworks.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
