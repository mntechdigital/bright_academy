
import Image from "next/image";
import directorImage from "../../../../public/directorimage.png"; // replace with your actual director image

const messages = [
  {
    title: "পরিচালকের বাণী",
    text: "ব্রাইট একাডেমির মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা। আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।",
  },
  {
    title: "পরিচালকের বাণী",
    text: "ব্রাইট একাডেমির মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা। আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।",
  },
  {
    title: "পরিচালকের লক্ষ্য",
    text: "ব্রাইট একাডেমির মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা। আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।",
  },
];

const TargetIcon = () => (
  <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-xl">
    🎯
  </div>
);

export default function HomeDirectorSection() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Eyebrow */}
        <div className="flex justify-center mb-10">
          <span className="border-l-4 border-orange-500 pl-3 text-sm text-gray-600 bg-white py-1.5 pr-4 shadow-sm">
            পরিচালকের বাণী
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left — Director Card */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {/* Photo */}
            <div className="relative w-full h-72 bg-gray-100 flex items-center justify-center">
              <Image
                src={directorImage}
                alt="Director"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col items-center py-5 gap-1">
              <h3 className="text-xl font-bold text-gray-900">সুমন রায়</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-6 h-px bg-gray-300" />
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div className="w-6 h-px bg-gray-300" />
              </div>
            </div>

            {/* Qualification */}
            <div className="border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-600">B.Com (Hon's); M.Com</p>
            </div>
          </div>

          {/* Right — Message Cards */}
          <div className="flex flex-col gap-5">
            {messages.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-5 flex gap-4 items-start shadow-sm border-l-4 border-l-orange-400"
              >
                <TargetIcon />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}