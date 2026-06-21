"use client";

import Link from "next/link";
import newsData from "@/src/data/news.json";

type BadgeType = "জরুরী" | "সাফল্য" | "তথ্য";

const badgeStyles: Record<BadgeType, string> = {
  জরুরী: "text-orange-500",
  সাফল্য: "text-orange-500",
  তথ্য: "text-orange-500",
};

type NewsItem = {
  id: string;
  badge: BadgeType;
  title: string;
  description: string;
};

const news: NewsItem[] = newsData.map((item: any) => ({
  id: item.id,
  badge: item.badge as BadgeType,
  title: item.title,
  description: item.description,
}));

const ArrowIcon = () => (
  <svg
    width="60"
    height="10"
    viewBox="0 0 60 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-300"
  >
    <line x1="0" y1="5" x2="50" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 1L1 5L5 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HomepageNewsSection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="border-l-4 border-orange-500 pl-3 text-sm text-gray-600 bg-white py-1.5 pr-4 shadow-sm">
            সংবাদ ও ঘোষণা
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
          সাম্প্রতিক আপডেট ও গুরুত্বপূর্ণ তথ্য
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="block"
            >
              <div
                className="border border-gray-100 rounded-2xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer"
              >
                {/* Badge + arrow */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${badgeStyles[item.badge]}`}>
                    {item.badge}
                  </span>
                  <ArrowIcon />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>

                {/* Divider */}
                <div className="h-px bg-gray-200" />

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}