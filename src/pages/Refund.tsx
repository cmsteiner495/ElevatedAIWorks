import { Layout } from '@/components/layout/Layout';
import { RotateCcw } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

const Refund = () => {
  return (
    <Layout>
      <PageMeta
        title="Refund Policy | Elevated AI Works"
        description="We stand behind the quality of our work. Our goal is your complete satisfaction with every project."
        canonicalPath="/refund"
      />
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <RotateCcw className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Refund Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            <div className="prose prose-lg prose-invert max-w-none space-y-6 text-muted-foreground">
              <h2 className="font-display text-2xl font-bold text-foreground">Our Commitment</h2>
              <p>
                We stand behind the quality of our work. Our goal is your complete satisfaction with every project. If you're not happy, we want to make it right.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Consultation & Planning Phase</h2>
              <p>
                Initial consultation calls are free. If you decide not to proceed after a paid discovery or strategy session, you may request a 50% refund within 7 days of the session.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Project Deposits</h2>
              <p>
                Project deposits (typically 30-50% of the project total) are non-refundable once work has begun. This covers the time and resources allocated to your project from day one.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Work in Progress</h2>
              <p>
                If you need to cancel a project mid-way, you will be billed for work completed to date. We'll provide all work-in-progress files and a detailed breakdown of time spent.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Revisions & Satisfaction</h2>
              <p>
                All projects include a specified number of revision rounds. We work collaboratively to ensure the final deliverables meet your expectations before final payment is due.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Maintenance & Ongoing Services</h2>
              <p>
                Monthly maintenance and retainer services can be cancelled with 30 days notice. Unused prepaid hours do not carry over or qualify for refunds.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Disputes</h2>
              <p>
                If you're unsatisfied with any aspect of our work, please contact us within 14 days of delivery. We'll work together to find a fair resolution.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Contact Us</h2>
              <p>
                For refund requests or questions about this policy, please email hello@elevatedaiworks.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Refund;
