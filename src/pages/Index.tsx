import { Link } from 'react-router-dom';
import { Palette, Globe, FileText, Bot, Search, BarChart3, Wrench, ArrowRight, Shield, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { PageMeta } from '@/components/seo/PageMeta';
import logoFull from '@/assets/logo-full.png';

const features = [
  {
    icon: Palette,
    title: 'Branding & logos',
    description: 'Clean, flexible identity that works across print, web, and social.',
  },
  {
    icon: Globe,
    title: 'Websites',
    description: 'Fast, mobile-ready sites built for clarity and real results.',
  },
  {
    icon: FileText,
    title: 'Systems & docs',
    description: 'Invoices, intake forms, and templates tailored to your workflow.',
  },
  {
    icon: Bot,
    title: 'AI tools',
    description: 'Practical automation that feels helpful, not robotic.',
  },
];

const addOns = [
  {
    icon: Search,
    title: 'SEO',
    description: 'Technical and on-page optimization so customers can actually find you.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Tracking that shows what works, where leads come from, and what to improve.',
  },
  {
    icon: Wrench,
    title: 'Maintenance',
    description: 'Ongoing updates, fixes, and improvements to keep things running smoothly.',
  },
];

const whyDifferent = [
  {
    icon: Shield,
    title: 'Transparent from the start',
    description: 'No hidden fees, no surprise upsells. You know what you\'re getting before we begin.',
  },
  {
    icon: Target,
    title: 'Focused on outcomes',
    description: 'We build what actually helps your business — not just what looks impressive.',
  },
  {
    icon: Heart,
    title: 'Client-first decisions',
    description: 'Sometimes the best advice is simpler than you think. We\'ll tell you when less is more.',
  },
];

const Index = () => {
  return (
    <Layout>
      <PageMeta
        title="Elevated AI Works | Web Design & Branding in Colorado Springs"
        description="Elevated AI Works delivers branding, web design, and practical AI tools for Colorado Springs businesses ready to grow with polished, modern digital experiences."
        canonicalPath="/"
      />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center">
        <div className="container py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <p className="text-xs sm:text-sm font-medium text-primary/80 tracking-wide mb-4 sm:mb-6 opacity-0 animate-fade-up">
                Logos • Brand Kits • Websites • Docs • Business Systems
              </p>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4 sm:mb-6 opacity-0 animate-fade-up delay-100">
                Thoughtful design and practical tools.{' '}
                <span className="text-gradient">Built for Colorado.</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8 opacity-0 animate-fade-up delay-200">
                We help small businesses look polished and run smoother — with branding, websites, and systems that actually make sense for how you work while serving Colorado Springs and the surrounding communities.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 opacity-0 animate-fade-up delay-300">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Book a Free Consult
                  </Button>
                </Link>
                <Link to="/portfolio" className="w-full sm:w-auto">
                  <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                    See Our Work
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>

              {/* Subline */}
              <p className="text-xs sm:text-sm text-muted-foreground/80 opacity-0 animate-fade-up delay-400">
                Built for real people: local businesses, creators, and entrepreneurs who want quality work without the agency overhead.
              </p>
            </div>

            {/* Right - Feature Card */}
            <div className="hidden lg:block opacity-0 animate-fade-up delay-300">
              <div className="rounded-2xl p-6 lg:p-8 bg-card/60 backdrop-blur-sm border border-border/30">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/30">
                  <img src={logoFull} alt="Elevated AI Works" className="h-14 w-14 rounded-xl" />
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">
                      What we do
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Design, development, and practical AI.
                    </p>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      style={{ animationDelay: `${(index + 4) * 100}ms` }}
                    >
                      <h4 className="font-medium text-foreground mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section className="lg:hidden py-8 sm:py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-4 sm:p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30"
              >
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary mb-2 sm:mb-3" />
                <h3 className="font-display font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We're Different Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Why clients choose us
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              We work a little differently than most agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {whyDifferent.map((item) => (
              <div
                key={item.title}
                className="p-5 sm:p-6 lg:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/20"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Add Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center mb-3 sm:mb-4">
            Beyond the basics
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12 max-w-xl mx-auto px-4">
            Every project includes the essentials. These add-ons help you get even more value.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {addOns.map((item) => (
              <div
                key={item.title}
                className="group p-5 sm:p-6 lg:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/20 hover:border-primary/30 transition-all duration-300"
              >
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3 sm:mb-4" />
                <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-card/60 backdrop-blur-sm border border-border/30">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Ready to get started?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Let's talk about what you're building. No pressure, no sales pitch — just a conversation about what might help.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Start a Conversation
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
