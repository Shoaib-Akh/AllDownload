import Hero from "@/components/home/Hero";
import PlatformGrid from "@/components/home/PlatformGrid";
import HowItWorks from "@/components/home/HowItWorks";
import Features from "@/components/home/Features";
import FAQ from "@/components/common/FAQ";
import { GLOBAL_FAQS } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Hero />
      <PlatformGrid />
      <HowItWorks />
      <Features />
      <FAQ faqs={GLOBAL_FAQS} />
    </>
  );
}
