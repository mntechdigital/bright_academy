import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import frame from "../../../../assets/hero-icon/Frame.png";
import frame01 from "../../../../assets/hero-icon/Frame (1).png";
import frame02 from "../../../../assets/hero-icon/Frame (2).png";
import frame03 from "../../../../assets/hero-icon/Frame (3).png";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="grid md:grid-cols-2 bg-[#F5F5F5] py-10">
      <div>
        <h4 className="block w-fit mx-auto bg-white text-[#2B2B2B] text-center px-4 py-2 border-l-2 border-l-[#f81717]">
          জ্ঞানের আকাঙ্ক্ষা করো। সীমাহীনভাবে শিখো।
        </h4>
        <h1 className="text-center font-semibold text-[28px] px-5 leading-9 mt-5">
          ব্রাইট একাডেমিক কেয়ারে স্বাগতম
        </h1>
        <p className="text-sm text-center leading-6 text-[#2B2B2B] px-11 mt-5">
          সাফল্যের স্বর্ণালী শিখরে পৌঁছাতে আমরা দৃঢ় প্রতিজ্ঞ। আমরা জানি,
          প্রতিশ্রুতি রক্ষায় আমরা ব্যক্তি নয়, বিবেকের কাছে দায়বদ্ধ।
        </p>

        <Link
          href="/"
          className="flex mx-auto w-fit btn border bg-white border-[#F68319]  hover:bg-[#e07210] sm:inline-flex items-center pl-4 pr-2 gap-2  text-[#2B2B2B] font-medium transition-all rounded-sm mt-10"
        >
          <span className="text-[16px] capitalize">আমাদের সম্পর্কে জানুন</span>

          <span className=" p-2 border  border-[#F68319] inline-flex rounded-sm items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-[#2B2B2B]" />
          </span>
        </Link>

        <div className="px-22 mt-8">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6 p-6 border border-[#F68319] rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center md:justify-start">
              <Image
                src={frame}
                alt="bright academic care"
                width={28}
                height={28}
              />
              <div>
                <h4 className="font-semibold text-2xl text-[#F68319]">৩০০০+</h4>
                <h6 className="text-[16px] text-[#2B2B2B]">সফল শিক্ষার্থী</h6>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center md:justify-start">
              <Image
                src={frame01}
                alt="bright academic care"
                width={28}
                height={28}
              />
              <div>
                <h4 className="font-semibold text-2xl text-[#F68319]">৪৫+</h4>
                <h6 className="text-[16px] text-[#2B2B2B]">অভিজ্ঞ শিক্ষক</h6>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center md:justify-start">
              <Image
                src={frame02}
                alt="bright academic care"
                width={28}
                height={28}
              />
              <div>
                <h4 className="font-semibold text-2xl text-[#F68319]">১৭+</h4>
                <h6 className="text-[16px] text-[#2B2B2B]">বছরের অভিজ্ঞতা</h6>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center md:justify-start">
              <Image
                src={frame03}
                alt="bright academic care"
                width={28}
                height={28}
              />
              <div>
                <h4 className="font-semibold text-2xl text-[#F68319]">১০০%</h4>
                <h6 className="text-[16px] text-[#2B2B2B]">সফলতার হার</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default HeroSection;
