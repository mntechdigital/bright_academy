"use client";
import React, { useState, useEffect } from "react";

const testimonials = [
  {
    name: "সাকিব হাসান",
    role: "শিক্ষার্থী - ক্লাস ১০",
    quote:
      "এখানকার শিক্ষা পদ্ধতি অনেক আধুনিক। গণিত আর বিজ্ঞানে আমার দুর্বলতা কাটিয়ে উঠতে পেরেছি। এখন আমি ক্লাসে প্রথম হই!",
  },
  {
    name: "তানিয়া আক্তার",
    role: "অভিভাবক",
    quote:
      "আমার মেয়ের পড়াশোনায় অসাধারণ উন্নতি হয়েছে। শিক্ষকরা অনেক যত্নশীল এবং প্রতিটি শিক্ষার্থীর দিকে আলাদাভাবে মনোযোগ দেন।",
  },
  {
    name: "রাহুল দেব",
    role: "শিক্ষার্থী - ক্লাস ৮",
    quote:
      "কম্পিউটার ল্যাব এবং আধুনিক সুবিধা পেয়ে পড়াশোনা আরও আনন্দময় হয়েছে। এখানে পড়তে আসা আমার জীবনের সেরা সিদ্ধান্ত।",
  },
  {
    name: "নাফিসা ইসলাম",
    role: "অভিভাবক",
    quote:
      "JSC পরীক্ষায় আমার ছেলে A+ পেয়েছে। এই কোচিং সেন্টারের শিক্ষকদের অক্লান্ত পরিশ্রম এবং নিষ্ঠার জন্য আমরা সত্যিই কৃতজ্ঞ।",
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = (index: number, dir: "next" | "prev" = "next") => {
    if (animating || index === active) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 300);
  };

  const prev = () => {
    const index = (active - 1 + testimonials.length) % testimonials.length;
    goTo(index, "prev");
  };

  const next = () => {
    const index = (active + 1) % testimonials.length;
    goTo(index, "next");
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [active]);

  const t = testimonials[active];

  const slideStyle = {
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction === "next" ? "20px" : "-20px"})`
      : "translateX(0)",
  };

  return (
    <section className="w-full bg-[#fdf8f3] overflow-hidden relative py-14 px-6">

      {/* Top-left orange blob */}
      <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-400 rounded-full opacity-90 pointer-events-none" />

      {/* Bottom-right orange ring */}
      <div className="absolute -bottom-8 -right-4 w-24 h-24 border-14 border-orange-400 rounded-full opacity-90 pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

        {/* Left: Avatar */}
        <div className="relative shrink-0">
          <div className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 24 24" fill="#9ca3af">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          {/* Quote badge */}
          <div className="absolute -left-4 bottom-8 w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center">
            <span className="text-gray-700 text-2xl font-serif" style={{ lineHeight: 1, marginTop: "-4px" }}>"</span>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0">

          {/* Eyebrow */}
          <div className="inline-flex items-center border border-gray-300 rounded px-3 py-1 mb-5">
            <span className="text-xs text-gray-500 tracking-wide">শিক্ষার্থীদের মতামত</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug">
            আমাদের সফল শিক্ষার্থী ও অভিভাবকদের অভিজ্ঞতা
          </h2>

          {/* Animated quote + name */}
          <div style={slideStyle}>
            <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-lg">
              "{t.quote}"
            </p>
            <p className="text-sm font-bold text-gray-900 mb-6">
              {t.name}{" "}
              <span className="font-normal text-gray-400">— {t.role}</span>
            </p>
          </div>

          {/* Dots + Arrows */}
          <div className="flex items-center gap-4">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > active ? "next" : "prev")}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-orange-400"
                      : "w-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 hover:text-orange-400 transition-colors text-gray-500"
                aria-label="Previous"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-400 hover:text-orange-400 transition-colors text-gray-500"
                aria-label="Next"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;