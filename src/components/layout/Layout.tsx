import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { CookieBanner } from '@/components/CookieBanner';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import mountainBg from '@/assets/mountain-bg.jpg';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <LocalBusinessSchema />
      {/* Global Mountain Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${mountainBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/92 to-background" />
      </div>
      
      <Header />
      <main className="flex-1 pt-16 lg:pt-20 relative z-10">
        {children}
      </main>
      <Footer />
      <CookieBanner />
      <ChatWidget />
    </div>
  );
}
