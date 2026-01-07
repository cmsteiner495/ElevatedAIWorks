import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Send, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PageMeta } from '@/components/seo/PageMeta';

const faqs = [
  {
    question: 'How much does a typical project cost?',
    answer: 'Projects vary based on scope, but we pride ourselves on fair, transparent pricing. A simple brand identity might start around $1,500, while a full website could range from $3,000-$8,000. We always provide detailed quotes upfront.',
  },
  {
    question: 'How long does a project take?',
    answer: 'Most branding projects take 2-4 weeks. Websites typically take 4-8 weeks depending on complexity. We will give you a realistic timeline during our initial consultation.',
  },
  {
    question: 'Do you work with clients outside Colorado?',
    answer: 'Absolutely! While we are based in Colorado, we work with clients across the US and internationally. All our collaboration happens virtually.',
  },
  {
    question: 'What makes you different from other agencies?',
    answer: 'We combine human creativity with practical AI tools to deliver agency-quality work at fair prices. We are small by choice, which means you get our full attention on every project.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes! We typically split projects into milestones with payments at the start, midpoint, and completion. For larger projects, we can work out custom arrangements.',
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(null);

    const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setIsSubmitting(false);
      setIsError('Form submission is currently unavailable. Please try again later.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      const isFormspreeSuccess = Boolean(data?.ok ?? data?.success);
      const isSuccessful = response.ok || isFormspreeSuccess;

      if (!isSuccessful) {
        throw new Error(data?.error || 'Unable to send message.');
      }

      setIsSuccess(true);
      form.reset();
      toast({
        title: 'Message sent!',
        description: "We'll get back to you within 24-48 hours.",
      });
    } catch (error) {
      setIsError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageMeta
        title="Contact | Elevated AI Works Colorado Springs"
        description="Contact Elevated AI Works to start your Colorado Springs branding or web design project. Share your goals and book a consult."
        canonicalPath="/contact"
      />
      {/* Hero - No dark overlay, mountain bg shows through */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-20 lg:pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 drop-shadow-lg">
              Let's Work Together
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed drop-shadow-md">
              Ready to elevate your project? Send us a message and let's start a conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                  Send a Message
                </h2>

                {isSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground">
                      We'll get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business">Business Name</Label>
                      <Input
                        id="business"
                        name="business"
                        placeholder="Your business or project name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your project..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </Button>
                    {isError ? (
                      <p className="text-sm text-destructive" role="alert">
                        {isError}
                      </p>
                    ) : null}
                  </form>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card/90 backdrop-blur-sm border border-border rounded-lg sm:rounded-xl px-4 sm:px-6 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-3 sm:py-4 text-sm sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-3 sm:pb-4 text-sm sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
