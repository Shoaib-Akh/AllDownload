import Hero from "@/components/home/Hero";
import AllTools from "@/components/home/AllTools";
import SupportedPlatformsSection from "@/components/home/SupportedPlatformsSection";
import ComparisonTable from "@/components/home/ComparisonTable";
import LatestUpdate from "@/components/home/LatestUpdate";
import DownloadGuides from "@/components/home/DownloadGuides";
import HomeFAQ from "@/components/home/HomeFAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <AllTools />
      <SupportedPlatformsSection />
      <ComparisonTable />
      <LatestUpdate />
      <DownloadGuides />
      <HomeFAQ />
    </>
  );
}
