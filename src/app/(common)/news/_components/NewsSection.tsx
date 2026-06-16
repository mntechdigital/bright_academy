import React from "react";

const news = [
  {
    tag: "জরুরী",
    tagColor: "text-orange-500",
    title: "নতুন ব্যাচ ভর্তি শুরু",
    description:
      "২০২৫ সালের নতুন শিক্ষাবর্ষের জন্য সকল ক্লাসে ভর্তি চলছে। সীমিত আসন। তাড়াতাড়ি যোগাযোগ করুন।",
  },
  {
    tag: "সাফল্য",
    tagColor: "text-orange-500",
    title: "JSC/SSC ফলাফল",
    description:
      "আমাদের ৯৫% শিক্ষার্থী JSC ও SSC পরীক্ষায় A+ গ্রেড অর্জন করেছে। অভিনন্দন সবাইকে!",
  },
  {
    tag: "তথ্য",
    tagColor: "text-orange-500",
    title: "নতুন কম্পিউটার ল্যাব",
    description:
      "আধুনিক কম্পিউটার ল্যাব স্থাপন করা হয়েছে। সর্বশেষ প্রযুক্তি দিয়ে সজ্জিত।",
  },
];

const NewsSection = () => {
  return (
    <section className="w-full py-14 px-4 bg-white">
      {/* Eyebrow */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-px h-5 bg-gray-300" />
        <span className="text-sm text-gray-500 tracking-wide">সংবাদ ও ঘোষণা</span>
      </div>

      {/* Heading */}
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-10 leading-snug">
        সাম্প্রতিক আপডেট ও গুরুত্বপূর্ণ তথ্য
      </h2>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <div key={index} className="px-6 py-4 border border-gray-200 rounded-lg shadow-lg transition-shadow duration-300">
            {/* Tag + line */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-sm font-semibold ${item.tagColor}`}>{item.tag}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;