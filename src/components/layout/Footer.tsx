import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import logoFull from '@/assets/logo-full.png';

const legalLinks = [
  { name: 'Legal Center', path: '/legal' },
  { name: 'AI Disclaimer', path: '/ai-disclaimer' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Refund Policy', path: '/refund' },
];

const serviceLinks = [
  { name: 'Branding & Logos', path: '/services' },
  { name: 'Website Design', path: '/services' },
  { name: 'Systems & Docs', path: '/services' },
  { name: 'AI Tools', path: '/services' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/share/1812Qn1Mxh/?mibextid=wwXIfr' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/elevatedaiworks/' },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-card/80 backdrop-blur-sm border-t border-border/30">
      <div className="container mx-auto px-4 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <img 
                src={logoFull} 
                alt="Elevated AI Works" 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg shrink-0"
              />
              <div>
                <h3 className="font-display font-bold text-foreground text-base sm:text-lg">
                  Elevated AI Works
                </h3>
              </div>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Thoughtful design and practical tools for real businesses. Based in Colorado, working with clients everywhere.
            </p>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm sm:text-base mb-4">
              Our Services
            </h4>
            <nav className="flex flex-col gap-2 sm:gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm sm:text-base mb-4">
              Legal
            </h4>
            <nav className="flex flex-col gap-2 sm:gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm sm:text-base mb-4">
              Follow Us
            </h4>
            <div className="flex flex-col gap-2 sm:gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Elevated AI Works on ${link.name}`}
                  className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.icon ? (
                    <link.icon size={16} className="shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] shrink-0">+</span>
                  )}
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/30">
          <p className="text-xs sm:text-sm text-muted-foreground text-center lg:text-left">
            © {new Date().getFullYear()} Elevated AI Works. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
