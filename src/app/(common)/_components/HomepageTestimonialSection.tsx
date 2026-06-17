"use client";

import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote: "এখানকার শিক্ষা পদ্ধতি অনেক আধুনিক। গণিত আর বিজ্ঞানে আমার দুর্বলতা কাটিয়ে উঠতে পেরেছি। এখন আমি ক্লাসে প্রথম হই!",
    name: "সাকিব হাসান",
    role: "শিক্ষার্থী - ক্লাস ১০",
    image: null,
  },
  {
    quote: "আমার মেয়ে এখানে ভর্তির পর থেকে পড়াশোনায় অনেক মনোযোগী হয়েছে। শিক্ষকরা অত্যন্ত যত্নশীল এবং দায়িত্বশীল।",
    name: "রাহেলা বেগম",
    role: "অভিভাবক",
    image: null,
  },
  {
    quote: "ব্রাইট একাডেমির ছোট ব্যাচের কারণে প্রতিটি ছাত্রছাত্রী আলাদা মনোযোগ পায়। এটাই এখানকার সবচেয়ে বড় সুবিধা।",
    name: "তানভীর আহমেদ",
    role: "শিক্ষার্থী - ক্লাস ৮",
    image: null,
  },
];

export default function HomepageTestimonialSection() {
  const [current, setCurrent] = useState(0);
  const active = testimonials[current];

  return (
    <section
      className="w-full relative overflow-hidden py-14 flex items-center"
      style={{ background: "#fdeee0" }}
    >
      {/* Top-left orange triangle shape */}
      <div className="absolute top-0 left-0 z-0 w-14 h-16 overflow-hidden">
        <div
          className="w-20 h-20 bg-orange-500 rounded-br-full"
          style={{ marginTop: "-10px", marginLeft: "-10px" }}
        />
      </div>

      {/* Bottom-right orange circle (half visible) */}
      <div className="absolute bottom-0 right-0 z-0 w-24 h-24 rounded-full bg-orange-500 translate-x-10 translate-y-10" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-10">

        {/* Left — Avatar block */}
        <div className="relative shrink-0 flex items-center justify-center w-72 h-72">
          {/* Large white circle */}
          <div className="w-64 h-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
            {active.image ? (
              <Image
                src={active.image}
                alt={active.name}
                width={256}
                height={256}
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              /* Default silhouette SVG */
              <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48">
                <circle cx="60" cy="38" r="28" fill="#2d2d2d" />
                <ellipse cx="60" cy="112" rx="46" ry="32" fill="#2d2d2d" />
              </svg>
            )}
          </div>

          {/* Quote badge — left-center of circle */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center shadow-md z-10"
          >
            <span className="text-gray-900 font-black text-lg leading-none select-none">"</span>
          </div>
        </div>

        {/* Right — Text content */}
        <div className="flex flex-col gap-5 flex-1">

          {/* Eyebrow tag */}
          <div className="inline-flex w-fit">
            <span className="border-l-4 border-orange-500 pl-3 text-sm text-gray-700 bg-white/60 py-1 pr-4">
              শিক্ষার্থীদের মতামত
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            আমাদের সফল শিক্ষার্থী ও অভিভাবকদের অভিজ্ঞতা
          </h2>

          {/* Quote text */}
          <p className="text-gray-800 text-base leading-relaxed max-w-xl">
            "{active.quote}"
          </p>

          {/* Name & role */}
          <p className="text-gray-900 text-sm font-semibold">
            <span className="font-extrabold">{active.name}</span>
            <span className="mx-2 text-gray-500">—</span>
            <span className="font-normal text-gray-600">{active.role}</span>
          </p>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-1">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-8 bg-orange-500"
                    : "w-6 bg-gray-400 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}