import React from "react";

const contacts = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    title: "আমাদের অবস্থান",
    lines: ["ব্রাইট একাডেমিক", "বরিশাল, বাংলাদেশ"],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11.9 19.79 19.79 0 0 1 1.08 3.27 2 2 0 0 1 3.07 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16v.92z"/>
        <path d="M14.5 2.5c2.5.5 4.5 2.5 5 5" opacity="0.5"/>
        <path d="M14.5 6.5c1 .5 2 1.5 2.5 2.5" opacity="0.5"/>
      </svg>
    ),
    title: "ফোন নম্বর",
    lines: ["০১৭১৬৬১১২০৮", "০১৭১৯৯৬৪০০৮", "০১৭১৮৪২৮৪৫২"],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
    title: "ইমেইল",
    lines: ["Info@Brightacademiccare.Com"],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "সময়সূচি",
    lines: ["সকাল ৮:০০ - রাত ৮:০০", "সপ্তাহে ৬ দিন"],
  },
];

const ContactInfo = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contacts.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-[#fdf8f3] rounded-2xl px-6 py-8 gap-4"
          >
            {/* Icon circle */}
            <div className="w-14 h-14 rounded-full bg-orange-400 flex items-center justify-center shrink-0">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>

            {/* Lines */}
            <div className="flex flex-col gap-0.5">
              {item.lines.map((line, i) => (
                <p key={i} className="text-sm text-gray-500 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactInfo;