import Image from "next/image";
import directorImage from "../../../../public/director.png"; // replace with your actual director image

const directorMessage = {
  greeting: "সম্মানিত অভিভাবক ও শিক্ষার্থীবৃন্দ,\nসালাম ও শুভেচ্ছা রইল।",
  paragraphs: [
    `সময়ের প্রয়োজনে এবং যুগের চাহিদা অনুযায়ী বর্তমান শিক্ষা ব্যবস্থায় যে যুগান্তকারী পরিবর্তন এসেছে, সে লক্ষ্যে বরিশাল সদরের বগুড়া রোডে প্রযুক্তি সমৃদ্ধ আধুনিক শিক্ষা প্রতিষ্ঠান "দি ব্রাইট একাডেমি"।`,
    `আমি অত্যন্ত আনন্দের সাথে জানাচ্ছি যে, "দি ব্রাইট একাডেমি" বরিশাল অত্যন্ত সফলতার সাথে সপ্তম বৎসর অতিক্রম করলো। প্রতিষ্ঠালগ্ন থেকেই একাডেমিটিতে তৃতীয় থেকে দ্বাদশ শ্রেণি ও এসএসসি পরীক্ষায় ধারাবাহিকভাবে সাফল্য অর্জন করে আসছে। শুধু তাই নয়, বরিশালের নামকরা যেসকল শিক্ষা প্রতিষ্ঠান আছে সেইসকল শিক্ষা প্রতিষ্ঠানগুলোর সাথে সমন্বয় করে অত্র একাডেমিতে শিক্ষার্থীরা কৃতীত্বের সাথে সন্তোষজনক হারে ভালো ফলাফল অর্জন করে আসছে। সাম্প্রতিকালে বাংলাদেশ সরকার শিক্ষা ব্যবস্থাকে আরও সময়োপযোগী করে তোলার লক্ষ্যে শিক্ষা বিস্তারের একটি গুণগত পরিবর্তন এনেছে। এ ব্যবস্থায় পূর্বের তিনটি শিক্ষা স্তরকে পুনর্বিন্যাস করে সাজিয়েছে। স্তরগুলো হলো- ১. প্রাথমিক স্তর ২. মাধ্যমিক স্তর এবং ৩. উচ্চ-মাধ্যমিক স্তর। সরকার প্রণীত এ ধরনের নতুন শিক্ষানীতি অনুসরণ করে "দি ব্রাইট একাডেমি" সকল পাঠদান পরিচালিত করছে। এ ধারা আগামীতেও অত্র একাডেমিতে অব্যাহত থাকবে বলে আমি আশা রাখি।`,
  ],
};

const closingNote = {
  text: `এরূপ আশাব্যক্ত করে সাফল্যের পেছনে শিক্ষকগণের আন্তরিক প্রচেষ্টা, ছাত্র-ছাত্রীদের নিরলস পরিশ্রম, অভিভাবক ও অফিস সহকারীবৃন্দের আন্তরিক সহযোগিতা এবং নিবিড় পরিদর্শন ও তত্ত্বাবধায়নে বিশেষ ভূমিকা রেখেছে বলে আমি মনে করি। এ ধারা অব্যাহত থাকলে আগামী দিনগুলোতেও এ শিক্ষা প্রতিষ্ঠানটি সাফল্যের দ্বার প্রান্তে পৌঁছোতে পারবে বলে আমার বিশ্বাস। তাই আপনাদের সকলের আন্তরিকতা ও সহযোগিতা আমি একান্তভাবে কামনা করছি।`,
  signOff: "শুভেচ্ছান্তে:-",
  name: "(সুমন রায়)",
  designation: "পরিচালক : দি ব্রাইট একাডেমি, বগুড়া রোড, বরিশাল।",
  mobile: "মোবাইল: ০১৭১৯-৯৩ ৬৮ ৮২",
};

const TargetIcon = () => (
  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-2xl">
    🎯
  </div>
);

export default function HomeDirectorSection() {
  return (
    <section className="w-full bg-[#fdf8f3] py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Eyebrow */}
        <div className="flex justify-center mb-10">
          <span className="border-l-4 border-orange-500 pl-3 text-sm text-gray-600 bg-white py-1.5 pr-4 shadow-sm">
            পরিচালকের বাণী
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

          {/* Left — Director Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {/* Photo */}
            <div className="relative w-full h-80 bg-gray-100">
              <Image
                src={directorImage}
                alt="পরিচালক - সুমন রায়"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col items-center py-5 gap-1">
              <h3 className="text-2xl font-bold text-gray-900">সুমন রায়</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-10 h-px bg-gray-300" />
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div className="w-10 h-px bg-gray-300" />
              </div>
            </div>

            {/* Qualification */}
            <div className="border-t border-gray-100 px-6 py-4 text-center">
              <p className="text-sm text-gray-600">B.Com (Hon's); M.Com</p>
            </div>
          </div>

          {/* Right — Single Message Card */}
          <div className="bg-white border-l-4 border-orange-400 border-y border-r border-gray-200 rounded-xl shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <TargetIcon />
              <h4 className="text-2xl font-bold text-gray-900">পরিচালকের বাণী</h4>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-base text-gray-700 leading-loose whitespace-pre-line mb-4">
              {directorMessage.greeting}
            </p>

            {directorMessage.paragraphs.map((para, idx) => (
              <p
                key={idx}
                className="text-base text-gray-700 leading-loose mb-4 text-justify"
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Closing Note */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <p className="text-base text-gray-700 leading-loose text-justify mb-6">
            {closingNote.text}
          </p>

          <div className="text-base text-gray-800 leading-relaxed">
            <p>{closingNote.signOff}</p>
            <p className="font-semibold">{closingNote.name}</p>
            <p>{closingNote.designation}</p>
            <p>{closingNote.mobile}</p>
          </div>
        </div>
      </div>
    </section>
  );
}