import { Layout } from '@/components/layout/Layout';
import { Bot } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

const AIDisclaimer = () => {
  return (
    <Layout>
      <PageMeta
        title="AI Disclaimer | Elevated AI Works"
        description="Elevated AI Works uses artificial intelligence tools and technologies as part of our creative and business processes."
        canonicalPath="/ai-disclaimer"
      />
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Bot className="w-12 h-12 text-primary mx-auto mb-6" />
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                AI Disclaimer
              </h1>
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>
            </div>

            <div className="prose prose-lg prose-invert max-w-none space-y-6 text-muted-foreground">
              <h2 className="font-display text-2xl font-bold text-foreground">Use of AI Technology</h2>
              <p>
                Elevated AI Works uses artificial intelligence tools and technologies as part of our creative and business processes. This includes, but is not limited to, content generation, design assistance, data analysis, and customer support automation.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Human Oversight</h2>
              <p>
                While AI assists our work, all deliverables are reviewed, refined, and approved by human team members. We believe AI should augment human creativity, not replace it. Every project receives personal attention and professional judgment.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Transparency</h2>
              <p>
                We are committed to being transparent about our use of AI. If you have questions about how AI was used in your specific project, we're happy to discuss our process with you.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Limitations</h2>
              <p>
                AI-generated content may occasionally contain errors or require adjustment. We take responsibility for the final quality of all work we deliver, regardless of the tools used in its creation.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Your Data</h2>
              <p>
                Any information you share with us that may be processed by AI tools is handled in accordance with our Privacy Policy. We do not use client data to train public AI models without explicit consent.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground">Questions?</h2>
              <p>
                If you have any questions about our use of AI technology, please contact us at hello@elevatedaiworks.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AIDisclaimer;
