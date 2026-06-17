import Image from "next/image";
import React from "react";
import gaolicon from "../assets/about-icon/goal icon.png";
import star from "../assets/about-icon/star.png";
import rightMark from "../assets/about-icon/righMark.png";
import image01 from "../assets/about-icon/Image.png";

const AboutSection = () => {
  return (
    <div className="mt-12 px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div className="w-full order-last md:order-first">
        <Image
          src={image01}
          alt="Bright Academic Care"
          className="w-full md:w-[450px] h-[600px]"
        />
      </div>

      <div>
        <h6 className="block w-fit mx-auto md:mx-0 bg-white text-[#2B2B2B] py-2 border-l-2 border-l-[#f81717] inset-shadow-2xs px-3">
          আমাদের সম্পর্কে
        </h6>
        <h1 className="text-[28px] leading-9 text-center md:text-start font-semibold mt-5">
          ব্রাইট একাডেমি - শিক্ষার মানোন্নয়নে প্রতিশ্রুতিবদ্ধ
        </h1>

        <div className="border-2 flex flex-col md:flex-row justify-items-center justify-center px-3.5 py-5 gap-7 rounded-2xl items-center md:items-start mt-8">
          <Image
            src={gaolicon}
            alt="Bright Academic Care"
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-[28px] font-semibold text-center md:text-start mb-3">
              আমাদের লক্ষ্য
            </h1>
            <p className="text-sm leading-6 text-center md:text-start">
              ব্রাইট একাডেমিক কেয়ারের মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত
              प्रतिভা বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা
              করা। আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।
            </p>
          </div>
        </div>

        <div className="border-2 flex flex-col md:flex-row justify-items-center justify-center md:justify-start px-3.5 py-5 gap-7 rounded-2xl mt-8">
          <Image
            src={star}
            alt="Bright Academic Care"
            className="w-12 h-12 mx-auto md:mx-0"
          />
          <div>
            <h1 className="text-[28px] font-semibold text-center md:text-start mb-3">
              আমাদের বিশেষত্ব
            </h1>
            <div className="flex gap-2">
              <Image src={rightMark} alt="Bright Academic Care" />
              <p className="text-sm leading-6 text-start">
                আধুনিক শিক্ষা পদ্ধতি
              </p>
            </div>
            <div className="flex gap-2">
              <Image src={rightMark} alt="Bright Academic Care" />
              <p className="text-sm leading-6 text-start">
                নিয়মিত মূল্যায়ন ও ফিডব্যাক
              </p>
            </div>
            <div className="flex gap-2">
              <Image src={rightMark} alt="Bright Academic Care" />
              <p className="text-sm leading-6 text-start">
                ছোট ব্যাচে ব্যক্তিগত যত্ন
              </p>
            </div>
            <div className="flex gap-2">
              <Image src={rightMark} alt="Bright Academic Care" />
              <p className="text-sm leading-6 text-start">
                অভিভাবকদের সাথে নিয়মিত যোগাযোগ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
