import IsItLegalContent from "@/components/legal/IsItLegalContent";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata = {
  title: "Is It Legal to Download Videos? · Complete Legal Guide | SaveFromPro",
  description:
    "A plain-language look at where downloading social media videos stands legally, copyright vs Terms of Service, regional breakdown, and FAQ.",
  alternates: {
    canonical: `${SITE_URL}/is-it-legal`,
  },
  openGraph: {
    title: "Is It Legal to Download Videos? · Legal Guide | SaveFromPro",
    description:
      "A plain-language look at where downloading social media videos stands legally, copyright vs Terms of Service, regional breakdown, and FAQ.",
    url: `${SITE_URL}/is-it-legal`,
    siteName: SITE_NAME,
  },
};

export default function IsItLegalPage() {
  return <IsItLegalContent />;
}
