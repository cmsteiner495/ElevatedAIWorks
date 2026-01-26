import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageMeta } from '@/components/seo/PageMeta';
import elevatedWealthLogo from '@/assets/portfolio/ElevatedWealthLogo.png';
import elevatedHealthLogo from '@/assets/portfolio/ElevatedHealthLogo.png';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  problem: string | null;
  solution: string | null;
  outcomes: string[];
  categories: string[];
  image_url: string | null;
  external_link: string | null;
  cta_label: string | null;
  display_order: number;
}

const categories = ['All', 'Branding', 'Website', 'UI/UX', 'Product'];
const mockProjects: PortfolioProject[] = [
  {
    id: 'elevated-wealth',
    title: 'Elevated Wealth',
    description:
      'AI-assisted personal finance PWA for budgeting, transactions, and planning.',
    problem: null,
    solution: null,
    outcomes: [
      'Mobile-first dashboard + budget UI',
      'Bottom navigation with contextual “+” action drawer',
      'Supabase backend with authentication',
      'PWA-ready install experience',
    ],
    categories: ['UI/UX', 'Product', 'PWA', 'Finance', 'Supabase', 'Auth', 'AI Tools'],
    image_url: elevatedWealthLogo,
    external_link: 'https://wealth.elevated-apps.com',
    cta_label: 'View Live',
    display_order: 1,
  },
  {
    id: 'elevated-health',
    title: 'Elevated Health',
    description:
      'AI-assisted wellness PWA for calorie and macro tracking with coach-style guidance.',
    problem: null,
    solution: null,
    outcomes: [
      'Clean meal and workout logging flows',
      'Dashboard widgets and weekly planning UI',
      'Mobile-first layout with PWA install support',
      'Privacy-first direction for AI features',
    ],
    categories: ['UI/UX', 'Product', 'PWA', 'Health', 'Nutrition', 'AI Coach'],
    image_url: elevatedHealthLogo,
    external_link: 'https://health.elevated-apps.com',
    cta_label: 'View Live',
    display_order: 2,
  },
  {
    id: 'true-west-handyman',
    title: 'True West Handyman',
    description:
      'Colorado-themed small business website designed to build trust, showcase services clearly, and drive quote requests.',
    problem:
      'The business needed a modern, trustworthy site that felt local and credible—while making it easy for customers to understand services and request help quickly.',
    solution:
      'Designed a multi-section homepage, refined service structure and messaging, improved mobile UX, and implemented a streamlined quote/contact flow with SEO-friendly structure.',
    outcomes: [
      'Clearer service presentation for customers',
      'Improved mobile-first browsing experience',
      'More direct quote-request pathway',
    ],
    categories: ['Website', 'Branding'],
    image_url: '/portfolio/True-West-Handyman.png',
    external_link: 'https://truewesthandyman.com',
    cta_label: 'View Project',
    display_order: 3,
  },
  {
    id: 'paws-whiskers-care',
    title: 'Paws & Whiskers Care',
    description:
      'Friendly, approachable pet care site built for quick service clarity and easy contact/booking from any device.',
    problem:
      'The brand needed a clean, welcoming site that quickly answers “what do you offer?” and makes it easy to reach out without friction.',
    solution:
      'Built a simple, mobile-first experience with clear service sections, polished layout, and a contact-focused conversion path.',
    outcomes: [
      'Cleaner service clarity and navigation',
      'More confident first impression for new clients',
      'Faster path to inquiry/contact',
    ],
    categories: ['Website', 'Branding'],
    image_url: '/portfolio/paws-whiskers-care.png',
    external_link:'https://pawsandwhiskerscare.netlify.app/',
    cta_label: 'View Project',
    display_order: 4,
  },
  {
    id: 'rose-noir',
    title: 'Rosé Noir',
    description:
      'Premium wedding brand experience with cinematic visuals and refined editorial-style layout. (Coming Soon)',
    problem:
      'The brand needed to communicate a premium vibe without ultra-luxury pricing—building trust and emotion fast.',
    solution:
      'Established brand direction, cinematic hero concept, and premium layout/messaging framework designed for high-intent couples.',
    outcomes: ['Coming soon'],
    categories: ['Website', 'Branding'],
    image_url: '/portfolio/rose-noir.png',
    external_link: null,
    cta_label: null,
    display_order: 5,
  },
];

const Portfolio = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(mockProjects);
    setLoading(false);
  }, []);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.categories.includes(filter));

  return (
    <Layout>
      <PageMeta
        title="Portfolio | Elevated AI Works Colorado Springs"
        description="Browse recent branding, web design, and product work from Elevated AI Works helping Colorado Springs businesses stand out online."
        canonicalPath="/portfolio"
      />
      {/* Hero */}
      <section className="pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-20 lg:pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Our Work
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Real projects for real businesses. Each one built to solve a specific problem.
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-6 sm:pb-8">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card/60 rounded-xl sm:rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setSelectedProject(project);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="portfolioCard group h-full text-left bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl sm:rounded-2xl hover:border-primary/40 transition-all duration-300"
                >
                  <div className="portfolioCardImage bg-secondary/30">
                    <img
                      src={project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                      alt={project.title}
                      className="portfolioCardImageImg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="portfolioCardContent flex flex-1 flex-col gap-3 p-4 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.categories.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs bg-secondary/50">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    {project.external_link && (
                      <a
                        href={project.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:text-sm"
                      >
                        {project.cta_label || 'View Project'}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="portfolioModal max-w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 max-h-[85vh] overflow-y-auto">
          {selectedProject && (
            <>
              <div className="portfolioModalHero mb-3 sm:mb-4 bg-secondary/30">
                <img
                  src={selectedProject.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                  alt={selectedProject.title}
                  className="portfolioModalHeroImg"
                />
              </div>
              <DialogHeader>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                  {selectedProject.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="bg-secondary/50 text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <DialogTitle className="font-display text-xl sm:text-2xl">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-3 sm:space-y-4 mt-2">
                {selectedProject.problem && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">The Challenge</h4>
                    <DialogDescription className="text-sm sm:text-base leading-relaxed">
                      {selectedProject.problem}
                    </DialogDescription>
                  </div>
                )}
                
                {selectedProject.solution && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">What We Did</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                )}
                
                {selectedProject.outcomes && selectedProject.outcomes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-1.5 sm:mb-2 text-sm sm:text-base">Results</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {selectedProject.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Portfolio;
