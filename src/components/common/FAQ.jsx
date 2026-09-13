'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ({ faqs, title = 'Frequently Asked Questions', subtitle = 'Got questions? We have answers.' }) {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">{title}</h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg transition-colors">{subtitle}</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/50 rounded-xl overflow-hidden shadow-sm transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-slate-900 dark:text-white font-medium text-sm sm:text-base pr-4 transition-colors">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-violet-600 dark:text-violet-400' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 border-t border-slate-100 dark:border-gray-800/40 pt-3">
          <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
