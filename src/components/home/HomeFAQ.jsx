'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQJsonLd } from '@/components/seo/JsonLd';

export const HOME_FAQS = [
  {
    question: 'Is SaveFromPro free to use?',
    answer:
      "Yes. Pasting a link and saving a file doesn't require payment or a subscription on any of the twelve supported platforms.",
  },
  {
    question: 'Do I need to install an app?',
    answer:
      "No. SaveFromPro runs entirely in your browser, on both mobile and desktop, so there's nothing to install and nothing to update.",
  },
  {
    question: 'Can I download from a private account?',
    answer:
      "No. If a post isn't visible to the public, SaveFromPro can't fetch it. This is intentional — it keeps the tool aligned with what people have already chosen to share publicly.",
  },
  {
    question: 'Will the download have a watermark on it?',
    answer:
      "SaveFromPro doesn't add its own watermark. Whether the original file already includes one depends on the platform and the creator's settings.",
  },
  {
    question: 'Which file format do I get?',
    answer:
      'Video typically saves as MP4 and photos as JPG or PNG — standard formats that play on virtually any phone, tablet or computer.',
  },
  {
    question: 'Is it safe to paste a link from any of these platforms?',
    answer:
      "SaveFromPro only reads the public link you paste to locate the media file; it doesn't ask for your username, password, or platform login at any point.",
  },
  {
    question: 'Why do I need a separate page for each platform?',
    answer:
      "Each platform structures its share links and media files differently, so a page tuned to one platform's link format gives more reliable results than a single one-size-fits-all box.",
  },
  {
    question: 'Can I use SaveFromPro on my phone?',
    answer:
      "Yes — open the site in your phone's browser, paste the link from the share sheet, and save the file to your camera roll or downloads folder.",
  },
  {
    question: 'Does SaveFromPro work the same way on every platform?',
    answer:
      "The paste-and-fetch idea is the same everywhere, but each platform's dedicated page is tuned to that platform's link format and content types, which gives more reliable results than one generic box.",
  },
  {
    question: 'What happens to a link after I paste it?',
    answer:
      "It's used only to locate and prepare the file for you to save — SaveFromPro doesn't keep a history of links or files once your download is complete.",
  },
  {
    question: "What if a platform I use isn't listed here?",
    answer:
      "The twelve platforms above cover the majority of everyday video and photo sharing. If a link from one of them doesn't resolve, double-check that the specific post is public before assuming the tool doesn't support it.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-100/60 dark:bg-gray-950/60 relative overflow-hidden border-t border-slate-200 dark:border-gray-800/40 transition-colors duration-200">
      <FAQJsonLd faqs={HOME_FAQS} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {HOME_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-white dark:bg-gray-900/60 backdrop-blur-xl border border-slate-200 dark:border-gray-800/80 overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-gray-700/80 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg transition-colors">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800/60 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-violet-100 text-violet-700 dark:bg-violet-600/20 dark:text-violet-400' : 'text-slate-500 dark:text-gray-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-gray-800/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
