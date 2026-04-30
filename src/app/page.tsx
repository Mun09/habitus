import { Hero } from "@/components/landing/hero";
import { MissionStrip } from "@/components/landing/mission-strip";
import { ProcessSteps } from "@/components/landing/process-steps";
import { FeaturedContractors } from "@/components/landing/featured-contractors";
import { TrustNumbers } from "@/components/landing/trust-numbers";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaStrip } from "@/components/landing/cta-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionStrip />
      <ProcessSteps />
      <FeaturedContractors />
      <TrustNumbers />
      <Testimonials />
      <CtaStrip />
    </>
  );
}
