import { Layout } from '@/components/layout/Layout';
import { Heart, Shield, Sparkles, Mountain } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';
import logoFull from '@/assets/logo-full.png';

const values = [
  {
    icon: Heart,
    title: 'Calm & Thoughtful',
    description: 'We take time to understand your needs before jumping into solutions. No rushed work, no chaos.',
  },
  {
    icon: Sparkles,
    title: 'Practical AI',
    description: 'AI should make things easier, not complicated. We use it where it genuinely helps.',
  },
  {
    icon: Shield,
    title: 'Trust-First',
    description: 'Transparent pricing, honest timelines, and work we stand behind. Your success is our success.',
  },
  {
    icon: Mountain,
    title: 'Colorado Crafted',
    description: 'Based in the Rockies, inspired by the clarity and quiet confidence of mountain life.',
  },
];

const timeline = [
  {
    year: '2023',
    title: 'The Beginning',
    description: 'Elevated AI Works was founded with a simple mission: bring agency-quality work to small businesses at fair prices.',
  },
  {
    year: '2024',
    title: 'Growing Together',
    description: 'We expanded our services to include AI tools and automation, helping clients work smarter.',
  },
];

const About = () => {
  return (
    <Layout>
      <PageMeta
        title="About | Elevated AI Works Colorado Springs Studio"
        description="Learn about Elevated AI Works, a Colorado Springs-based studio focused on thoughtful branding, web design, and practical AI tools."
        canonicalPath="/about"
      />
      {/* Hero */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center px-4">
            <img
              src={logoFull}
              alt="Elevated AI Works"
              className="h-16 w-16 sm:h-20 sm:w-20 mx-auto rounded-xl sm:rounded-2xl mb-6 sm:mb-8"
            />
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              About Elevated AI Works
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We're a small studio doing thoughtful work for real people. No corporate jargon, no inflated promises — just clean design and practical tools that help your business move forward.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-sm sm:prose-lg prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                Elevated AI Works started from a simple observation: small businesses deserve great design and smart tools, but most agencies price them out or over-complicate things.
              </p>
              <p className="text-sm sm:text-base">
                We set out to change that. Based in Colorado, we combine modern AI capabilities with traditional design craft to create brands, websites, and systems that work hard for our clients without breaking their budgets.
              </p>
              <p className="text-sm sm:text-base">
                Every project we take on gets our full attention. We're not trying to be the biggest studio — just one of the most helpful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 lg:py-24 bg-card">
        <div className="container">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-12 text-center">
            What We Believe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-secondary/50 hover-lift"
              >
                <value.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-3 sm:mb-4" />
                <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-12 text-center">
            Our Journey
          </h2>
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative pl-6 sm:pl-8 border-l-2 border-border space-y-6 sm:space-y-8">
              {timeline.map((item) => (
                <div key={item.year} className="relative">
                  <div className="absolute -left-[29px] sm:-left-[41px] w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary border-4 border-background" />
                  <span className="text-xs sm:text-sm font-medium text-primary">{item.year}</span>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mt-0.5 sm:mt-1 mb-1.5 sm:mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
