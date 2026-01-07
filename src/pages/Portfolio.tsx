import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageMeta } from '@/components/seo/PageMeta';

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
  display_order: number;
}

const categories = ['All', 'Branding', 'Website', 'UI/UX', 'Product'];
const mockProjects: PortfolioProject[] = [
  {
    id: 'elevate-dental',
    title: 'Elevate Dental Rebrand',
    description: 'A refreshed identity and patient-first website experience for a growing dental practice.',
    problem: 'The clinic needed to stand out in a crowded market while improving online appointment conversions.',
    solution: 'We delivered a new visual system, refined messaging, and a conversion-focused website redesign.',
    outcomes: ['32% increase in online bookings', '2x engagement on service pages', 'New brand guidelines adopted'],
    categories: ['Branding', 'Website'],
    image_url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=80',
    external_link: null,
    display_order: 1,
  },
  {
    id: 'pathway-saas',
    title: 'Pathway SaaS Dashboard',
    description: 'A user-centered product design overhaul for a B2B analytics platform.',
    problem: 'Users struggled to find key insights quickly, leading to churn concerns.',
    solution: 'We mapped core workflows and introduced a modular dashboard with clearer prioritization.',
    outcomes: ['25% faster task completion', '15% reduction in support tickets', 'Improved NPS scores'],
    categories: ['UI/UX', 'Product'],
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    external_link: null,
    display_order: 2,
  },
  {
    id: 'northwind-commerce',
    title: 'Northwind Commerce',
    description: 'A modern storefront experience that highlights craftsmanship and story-driven visuals.',
    problem: 'The brand needed a premium online presence to support new product launches.',
    solution: 'We built a storytelling-focused site with lightweight animations and curated product layouts.',
    outcomes: ['18% lift in average order value', '40% more product page views', 'Expanded email list'],
    categories: ['Website', 'Branding'],
    image_url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
    external_link: null,
    display_order: 3,
  },
  {
    id: 'lumen-mobile',
    title: 'Lumen Mobile App',
    description: 'A mobile experience built to help customers track wellness milestones effortlessly.',
    problem: 'The app needed clearer onboarding and a more motivating progress view.',
    solution: 'We redesigned onboarding flows, added quick wins, and highlighted progress trends.',
    outcomes: ['30% higher week-one retention', '50% more daily check-ins', 'Improved app store ratings'],
    categories: ['UI/UX', 'Product'],
    image_url: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=800&q=80',
    external_link: null,
    display_order: 4,
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
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group text-left bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-secondary/30">
                    <img
                      src={project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      {project.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs bg-secondary/50">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </button>
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
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg md:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 max-h-[85vh] overflow-y-auto">
          {selectedProject && (
            <>
              <div className="aspect-video rounded-lg overflow-hidden mb-3 sm:mb-4 bg-secondary/30">
                <img
                  src={selectedProject.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
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
