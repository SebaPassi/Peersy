'use client';

import { useState } from 'react';

export type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="container mx-auto px-6 py-8 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
        Frequently Asked Questions
      </h2>
      <div className="max-w-2xl mx-auto space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 text-white font-medium hover:bg-gray-800/50 transition-colors"
            >
              <span>{item.question}</span>
              <span
                className={`text-purple-400 text-xl transition-transform ${
                  openIndex === index ? 'rotate-45' : ''
                }`}
              >
                +
              </span>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-4 pt-0">
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
