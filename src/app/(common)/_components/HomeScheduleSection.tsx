import Image from "next/image";
import schedulebg from "../../../../public/homeschedule.png";
import schedule1 from "../../../../public/BG (7).png";
import schedule2 from "../../../../public/BG (7).png";
import schedule3 from "../../../../public/BG (7).png";
import schedule4 from "../../../../public/BG (7).png";

const schedules = [
  {
    grade: "৭ম – ১০ম শ্রেণি",
    time: "সকাল ৭ টা – ১০ টা",
    image: schedule1,
  },
  {
    grade: "৭ম – ৮ম শ্রেণি",
    time: "সকাল ৯ টা – ১২ টা",
    image: schedule2,
  },
  {
    grade: "৭ম – ১২ শ্রেণি",
    time: "দুপুর ২টা – ৫ টা",
    image: schedule3,
  },
  {
    grade: "৩য় – ১০ম শ্রেণি",
    time: "বিকাল ৫টা – ৮ টা",
    image: schedule4,
  },
];

export default function HomeScheduleSection() {
  return (
    <section className="w-full relative py-16 overflow-hidden">
      {/* Background Image */}
      <Image
        src={schedulebg}
        alt="Schedule Background"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="border border-orange-400 text-orange-400 text-xs font-medium px-4 py-1.5 rounded-sm bg-transparent">
            নির্ধারিত সময়
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-center text-white text-3xl md:text-4xl font-bold mb-12">
          বিভিন্ন শ্রেণির জন্য নির্ধারিত সময়
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {schedules.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-52">
                <Image
                  src={item.image}
                  alt={item.grade}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-3">
                <h3 className="text-gray-900 font-semibold text-base">
                  {item.grade}
                </h3>

                {/* Time Badge */}
                <div className="flex items-center justify-between bg-orange-500 rounded-lg px-4 py-2.5">
                  <span className="text-white text-sm font-semibold">সময়</span>
                  <span className="text-white text-sm font-semibold">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}