import Image from "next/image";
import aboutImage from "../../../../public/brightacademyposter.jpeg";
import topleft from "../../../../public/homeabouttopleft.png";
import bottomright from "../../../../public/homeaboutbottomright.png";

const features = [
  "অভিজ্ঞ ও দক্ষ শিক্ষকমণ্ডলী",
  "আধুনিক শিক্ষা পদ্ধতি",
  "নিয়মিত মূল্যায়ন ও ফিডব্যাক",
  "ছোট ব্যাচে ব্যক্তিগত যত্ন",
  "অভিভাবকদের সাথে নিয়মিত যোগাযোগ",
];

export default function HomeAboutSection() {
  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Image with decorative elements */}
        <div className="relative flex items-center justify-center min-h-105 lg:min-h-140">
          {/* Top-left decorative image */}
          <div className="absolute top-0 left-0 w-32 h-32 z-0">
            <Image src={topleft} alt="" fill className="object-contain" />
          </div>

          {/* Bottom-right decorative image */}
          <div className="absolute bottom-0 right-0 w-28 h-28 z-0">
            <Image src={bottomright} alt="" fill className="object-contain" />
          </div>

          {/* Main image */}
          <div className="relative z-20 w-full max-w-lg md:max-w-xl lg:max-w-2xl rounded-3xl overflow-hidden shadow-xl mx-auto">
            <Image
              src={aboutImage}
              alt="Bright Academy Classroom"
              width={580}
              height={560}
              className="w-full h-auto object-cover scale-110"
              priority
            />
          </div>
        </div>

        {/* Right — Content */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow */}
          <div className="inline-flex w-fit">
            <span className="border border-orange-400 text-orange-500 text-xs font-medium px-3 py-1 rounded-sm bg-orange-50">
              আমাদের সম্পর্কে
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            ব্রাইট একাডেমি – শিক্ষার <br className="hidden md:block" />
            মানোন্নয়নে প্রতিশ্রুতিবদ্ধ
          </h2>

          {/* Goal Card — left orange border only */}
          <div
            className="rounded-r-xl pl-5 pr-5 py-5 flex gap-4 items-start bg-white shadow-sm"
            style={{
              border: "1px solid #f3f4f6",
              borderLeft: "4px solid #fb923c",
            }}
          >
            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-xl">
              🎯
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-gray-900">
                  আমাদের লক্ষ্য
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                ব্রাইট একাডেমির মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা
                বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা।
                আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।
              </p>
            </div>
          </div>

          {/* Features Card — left orange border only */}
          <div
            className="rounded-r-xl pl-5 pr-5 py-5 flex gap-4 items-start bg-white shadow-sm"
            style={{
              border: "1px solid #f3f4f6",
              borderLeft: "4px solid #fb923c",
            }}
          >
            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-xl">
              🏅
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-gray-900">
                  আমাদের বিশেষত্ব
                </h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <ul className="flex flex-col gap-2">
                {features.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 text-sm text-gray-700"
                  >
                    <span className="text-orange-500 text-base leading-none">
                      ✔
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}