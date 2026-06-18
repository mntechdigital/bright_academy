import Image from "next/image";
import React from "react";
import studentIcon from "../../../../assets/teacher/teacher.png";
import quote from "../../../../assets/icons/double-quotes.png";
import bgEI from "../../../../assets/BG El.png";

const StudentsReview = () => {
  return (
    <div className="bg-[#FEF6EF] py-11 mt-11 flex flex-col-reverse md:flex-row gap-8 md:gap-20 items-center justify-center max-w-7xl mx-auto px-5 relative">
      <Image
        src={bgEI}
        alt="Bright Academic Care"
        className="absolute top-0 left-0"
      />
      <div className="w-64 h-64 bg-white rounded-full relative flex-shrink-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src={studentIcon}
            alt="Bright Academic Care"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-[#F68319] absolute -left-5 z-10 flex items-center justify-center">
          <Image
            src={quote}
            alt="Bright Academic Care"
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      <div className="max-w-xl md:text-left text-center">
        <h4 className="block w-fit md:mx-0 mx-auto bg-white text-[#2B2B2B] px-4 py-1 border-l-2 border-l-[#f81717] inset-shadow-sm">
          শিক্ষার্থীদের মতামত
        </h4>
        <h1 className="text-black md:text-left text-center font-semibold text-[28px] md:text-[32px] leading-9 mt-5">
          আমাদের সফল শিক্ষার্থী ও অভিভাবকদের অভিজ্ঞতা
        </h1>
        <p className="md:text-left text-center mt-6 text-[#555555] leading-relaxed">
          "এখানকার শিক্ষা পদ্ধতি অনেক আধুনিক। গণিত আর বিজ্ঞানে আমার দুর্বলতা
          কাটিয়ে উঠতে পেরেছি। এখন আমি ক্লাসে প্রথম হই।"
        </p>
        <div className="flex items-center gap-3 justify-center md:justify-start mt-3">
          <p className="text-2xl font-semibold ">সাকিব হাসান</p>
          <p className="w-10 h-0.5 border-2 border-black"></p>
          <p>শিক্ষার্থী - ক্লাস ১০</p>
        </div>
      </div>

      <div className="w-20 h-20 rounded-full border-20 border-[#F68319] absolute bottom-0 right-0 "></div>
    </div>
  );
};

export default StudentsReview;
