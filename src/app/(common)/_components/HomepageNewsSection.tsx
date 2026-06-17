
"use client";

type BadgeType = "জরুরী" | "সাফল্য" | "তথ্য";

const badgeStyles: Record<BadgeType, string> = {
  জরুরী: "text-orange-500",
  সাফল্য: "text-orange-500",
  তথ্য: "text-orange-500",
};

const news = [
  {
    badge: "জরুরী" as BadgeType,
    title: "নতুন ব্যাচ ভর্তি শুরু",
    description: "২০২৫ সালের নতুন শিক্ষাবর্ষের জন্য সকল ক্লাসে ভর্তি চলছে। সীমিত আসন। তাড়াতাড়ি যোগাযোগ করুন।",
  },
  {
    badge: "সাফল্য" as BadgeType,
    title: "JSC/SSC ফলাফল",
    description: "আমাদের ৯৫% শিক্ষার্থী JSC ও SSC পরীক্ষায় A+ গ্রেড অর্জন করেছে। অভিনন্দন সবাইকে!",
  },
  {
    badge: "তথ্য" as BadgeType,
    title: "নতুন কম্পিউটার ল্যাব",
    description: "আধুনিক কম্পিউটার ল্যাব স্থাপন করা হয়েছে। সর্বশেষ প্রযুক্তি দিয়ে সজ্জিত।",
  },
  {
    badge: "জরুরী" as BadgeType,
    title: "নতুন ব্যাচ ভর্তি শুরু",
    description: "২০২৫ সালের নতুন শিক্ষাবর্ষের জন্য সকল ক্লাসে ভর্তি চলছে। সীমিত আসন। তাড়াতাড়ি যোগাযোগ করুন।",
  },
  {
    badge: "সাফল্য" as BadgeType,
    title: "JSC/SSC ফলাফল",
    description: "আমাদের ৯৫% শিক্ষার্থী JSC ও SSC পরীক্ষায় A+ গ্রেড অর্জন করেছে। অভিনন্দন সবাইকে!",
  },
  {
    badge: "তথ্য" as BadgeType,
    title: "নতুন কম্পিউটার ল্যাব",
    description: "আধুনিক কম্পিউটার ল্যাব স্থাপন করা হয়েছে। সর্বশেষ প্রযুক্তি দিয়ে সজ্জিত।",
  },
];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 bg-white"
            >
              {/* Badge + line */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${badgeStyles[item.badge]}`}>
                  {item.badge}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-900">{item.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}