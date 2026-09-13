import FAQ from "@/components/common/FAQ";
import { GLOBAL_FAQS } from "@/lib/constants";

export const metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Got questions about SaveFromPro? Find answers to the most common questions about our free video downloader.",
};

export default function FAQPage() {
  return (
    <div className="py-10">
      <FAQ
        faqs={GLOBAL_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about SaveFromPro."
      />
    </div>
  );
}
