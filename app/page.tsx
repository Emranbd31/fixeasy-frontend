import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { PricingHighlights } from '@/components/home/PricingHighlights';
import { ProCTA } from '@/components/home/ProCTA';
import { ServiceGrid } from '@/components/home/ServiceGrid';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <ServiceGrid />
      <PricingHighlights />
      <HowItWorks />
      <ProCTA />
    </div>
  );
}
