import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { FileText, Bot, Shield, ScrollText, RotateCcw } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

const legalPages = [
  {
    icon: Shield,
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information.',
    path: '/privacy',
  },
  {
    icon: ScrollText,
    title: 'Terms of Service',
    description: 'The rules and guidelines for using our services.',
    path: '/terms',
  },
  {
    icon: Bot,
    title: 'AI Disclaimer',
    description: 'Important information about our use of AI technology.',
    path: '/ai-disclaimer',
  },
  {
    icon: RotateCcw,
    title: 'Refund Policy',
    description: 'Our policies regarding refunds and cancellations.',
    path: '/refund',
  },
];

const Legal = () => {
  return (
    <Layout>
      <PageMeta
        title="Legal Center | Elevated AI Works"
        description="Transparency matters to us. Here you'll find all our legal documents and policies."
        canonicalPath="/legal"
      />
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <FileText className="w-12 h-12 text-primary mx-auto mb-6" />
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Legal Center
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transparency matters to us. Here you'll find all our legal documents and policies.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {legalPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover-lift"
              >
                <page.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {page.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
