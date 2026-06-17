import Image from "next/image";
import heroCollage from "../../../../public/Union__1_.png";

const stats = [
  { icon: "🎓", value: "৭০০ +", label: "সফল শিক্ষার্থী" },
  { icon: "👨‍🏫", value: "৩০ +", label: "অভিজ্ঞ শিক্ষক" },
  { icon: "📋", value: "৭+", label: "বছরের অভিজ্ঞতা" },
  { icon: "⭐", value: "১০০%", label: "সফলতার হার" },
];

export default function HeroSection() {
  return (
    <section className="w-full bg-gray-100 min-h-130 flex items-center overflow-hidden relative">
      {/* Right side scroll buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        <button className="w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center rounded transition-colors">
          ↗
        </button>
        <button className="w-9 h-9 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center rounded transition-colors">
          ↙
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="flex flex-col gap-6">

          {/* Eyebrow tag */}
          <div className="inline-flex w-fit">
            <span className="border-l-4 border-orange-500 pl-3 text-sm text-gray-600 bg-white py-1.5 pr-4 shadow-sm">
              জ্ঞানের আকাঙ্ক্ষা করো। সীমাহীনভাবে শিখো।
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            ব্রাইট একাডেমিতে স্বাগতম
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed max-w-lg">
            সাফল্যের স্বর্ণালী শিখরে পৌঁছাতে আমরা দৃঢ় প্রতিজ্ঞা। আমরা জানি, প্রতিশ্রুতি রক্ষায় আমরা ব্যক্তি নয়, বিবেকের কাছে দায়বদ্ধ।
          </p>

          {/* CTA Button */}
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-3 border border-gray-800 hover:border-orange-500 hover:text-orange-500 text-gray-800 text-sm font-semibold px-5 py-3 rounded transition-all duration-150 no-underline group"
            >
              আমাদের সম্পর্কে জানুন
              <span className="w-7 h-7 bg-orange-500 group-hover:bg-orange-600 text-white flex items-center justify-center rounded text-xs transition-colors">
                ↗
              </span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-orange-300 rounded-lg overflow-hidden bg-white mt-2">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2.5 px-4 py-4 ${
                  idx < stats.length - 1 ? "border-r border-orange-200" : ""
                }`}
              >
                <span className="text-2xl leading-none">{stat.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Hero Collage Image */}
        <div className="relative flex items-center justify-center h-95 lg:h-105">
          <Image
            src={heroCollage}
            alt="Bright Academy Students"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}