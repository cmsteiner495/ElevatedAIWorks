import { Link } from 'react-router-dom';
import { Palette, Globe, FileText, Bot, Search, BarChart3, Wrench, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { PageMeta } from '@/components/seo/PageMeta';

const services = [
  {
    icon: Palette,
    title: 'Branding',
    subtitle: 'Logo & Identity Design',
    whoFor: 'For businesses starting out or ready to refresh their look. We create identities that feel professional and uniquely yours.',
    priceRange: '$25 – $150',
    priceNote: 'Depends on complexity and number of concepts',
    deliverables: [
      'Custom logo design (2-3 concepts)',
      'Brand color palette & typography',
      'Simple brand guidelines',
      'Social media profile kit',
      'Print-ready files',
    ],
  },
  {
    icon: Globe,
    title: 'Websites',
    subtitle: 'Modern, Fast, Mobile-Ready',
    whoFor: 'For businesses that need a real online presence — not just a social page. We build sites that look good and actually help you get customers.',
    priceRange: '$150 – $2,000',
    priceNote: 'Based on page count and features',
    deliverables: [
      'Custom responsive design',
      'Mobile-optimized layouts',
      'Contact forms & lead capture',
      'Basic SEO setup included',
      'Simple content management',
    ],
  },
  {
    icon: FileText,
    title: 'Systems & Docs',
    subtitle: 'Workflows That Work',
    whoFor: 'For service providers tired of messy paperwork. We create templates and systems that save time and look professional.',
    priceRange: '$50 – $500',
    priceNote: 'Varies by scope and customization',
    deliverables: [
      'Custom invoice templates',
      'Client intake forms',
      'Proposal & contract templates',
      'Process documentation',
      'Notion or Airtable setups',
    ],
  },
  {
    icon: Bot,
    title: 'AI Tools',
    subtitle: 'Practical Automation',
    whoFor: 'For businesses ready to work smarter. We set up AI tools that actually help — without making things feel impersonal.',
    priceRange: '$300 – $1,000',
    priceNote: 'Depends on integration complexity',
    deliverables: [
      'Custom AI chatbots & assistants',
      'Email automation workflows',
      'Content generation tools',
      'Integration with existing systems',
      'Training and documentation',
    ],
  },
  {
    icon: Search,
    title: 'SEO',
    subtitle: 'Get Found Online',
    whoFor: 'For businesses that want more customers from Google. We handle the technical stuff so you can focus on your work.',
    priceRange: '$25 – $100/month',
    priceNote: 'Ongoing optimization recommended',
    deliverables: [
      'Technical SEO audit & fixes',
      'Keyword research & strategy',
      'On-page optimization',
      'Local SEO setup',
      'Monthly progress reports',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    subtitle: 'Know Your Numbers',
    whoFor: 'For businesses that want to understand what\'s actually working. We set up tracking that\'s useful, not overwhelming.',
    priceRange: '$50 – $500',
    priceNote: 'One-time setup with optional reporting',
    deliverables: [
      'GA4 setup & configuration',
      'Custom event tracking',
      'Conversion goal setup',
      'Simple dashboard creation',
      'Optional monthly insights',
    ],
  },
  {
    icon: Wrench,
    title: 'Maintenance',
    subtitle: 'Ongoing Care',
    whoFor: 'For businesses that want their site to stay current without worrying about it. We handle updates so you don\'t have to.',
    priceRange: '$25 – $200/month',
    priceNote: 'Based on update frequency',
    deliverables: [
      'Regular security updates',
      'Performance monitoring',
      'Content updates & changes',
      'Backup management',
      'Priority support',
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      <PageMeta
        title="Services | Elevated AI Works in Colorado Springs"
        description="Explore branding, web design, SEO, and AI automation services from Elevated AI Works, supporting Colorado Springs businesses with clear, practical solutions."
        canonicalPath="/services"
      />
      {/* Hero */}
      <section className="pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-20 lg:pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              How We Can Help
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6">
              Clear services, honest pricing. We'll always recommend what actually makes sense for your situation — even if it means less work for us.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="pb-6 sm:pb-8">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">About our pricing:</strong> Every project is different. The ranges below cover most projects, but final pricing depends on your specific needs. We'll always give you a clear quote before starting.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <service.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      {service.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">{service.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 leading-relaxed">
                  {service.whoFor}
                </p>

                {/* Price Range */}
                <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 rounded-lg bg-secondary/30">
                  <p className="font-display font-semibold text-foreground text-sm sm:text-base">
                    {service.priceRange}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {service.priceNote}
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3">What's included</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Check size={14} className="sm:w-4 sm:h-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/contact">
                  <Button variant="hero" className="w-full text-sm sm:text-base">
                    Get a Quote
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-card/60 backdrop-blur-sm border border-border/30">
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Not sure what you need?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              That's completely fine. Book a free consultation and we'll help you figure out what makes sense for your business and budget.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Let's Talk
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
