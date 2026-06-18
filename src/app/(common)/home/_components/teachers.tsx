import React from "react";
import teacher from "../../../../assets/teacher/teacher.png";
import Image from "next/image";
const Teachers = () => {
  return (
    <div>
      <h4 className="block w-fit mx-auto bg-white text-[#2B2B2B]  px-4 py-1 border-l-2 border-l-[#f81717] mt-12 inset-shadow-sm">
        আমাদের শিক্ষকমণ্ডলী
      </h4>
      <h1 className="text-black text-center font-semibold text-[28px] leading-9 mt-5">
        শিক্ষা ও দক্ষতা শিক্ষকদের তত্ত্বাবধানে মানসম্পন্ন শিক্ষা
      </h1>

      <div className="flex flex-col md:flex-row gap-5 mt-10">
        <div className="card bg-white w-80 mx-auto shadow-sm">
          <div className="relative">
            <figure>
              <Image src={teacher} alt="Bright Academic Care" />
            </figure>
            <p className="bg-[#F68319] block w-max px-5 rounded-full text-[16px] py-1 absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white">
              গণিত শিক্ষক
            </p>
          </div>
          <div className="card-body px-0">
            <h2 className="card-title text-2xl mx-auto">মোঃ আব্দুল করিম</h2>
            <div className="flex items-center gap-2.5 justify-center mt-2 mb-4">
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
              <div className="w-2 h-2 bg-[#F68319] rounded-full"></div>
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
            </div>
            <div className="border-t-2 border-b-2 grid grid-cols-2 justify-items-center px-2.5">
              <p className="border-r-2 py-2 text-xs">
                M.Sc in Mathematics, ঢাকা বিশ্ববিদ্যালয়
              </p>
              <p className="py-2 text-xs">১৫ বছরের অভিজ্ঞতা</p>
            </div>
          </div>
        </div>
        <div className="card bg-white w-80 mx-auto shadow-sm">
          <div className="relative">
            <figure>
              <Image src={teacher} alt="Bright Academic Care" />
            </figure>
            <p className="bg-[#F68319] block w-max px-5 rounded-full text-[16px] py-1 absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white">
              বাংলা শিক্ষক
            </p>
          </div>
          <div className="card-body px-0">
            <h2 className="card-title text-2xl mx-auto">ফারিহা আক্তার</h2>
            <div className="flex items-center gap-2.5 justify-center mt-2">
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
              <div className="w-2 h-2 bg-[#F68319] rounded-full"></div>
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
            </div>
            <div className="border-t-2 border-b-2 grid grid-cols-2 justify-items-center px-2.5 mt-5">
              <p className="border-r-2 py-2 text-xs">
                M.A in Bengali, জাহাঙ্গীরনগর বিশ্ববিদ্যালয়
              </p>
              <p className="py-2 text-xs">১২ বছরের অভিজ্ঞতা</p>
            </div>
          </div>
        </div>
        <div className="card bg-white w-80 mx-auto shadow-sm">
          <div className="relative">
            <figure>
              <Image src={teacher} alt="Bright Academic Care" />
            </figure>
            <p className="bg-[#F68319] block w-max px-5 rounded-full text-[16px] py-1 absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white">
              পদার্থবিজ্ঞান শিক্ষক
            </p>
          </div>
          <div className="card-body px-0">
            <h2 className="card-title text-2xl mx-auto">ড. সাইফুল ইসলাম</h2>
            <div className="flex items-center gap-2.5 justify-center mt-2">
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
              <div className="w-2 h-2 bg-[#F68319] rounded-full"></div>
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
            </div>
            <div className="border-b-2 border-t-2 grid grid-cols-2 justify-items-center px-2.5 mt-5">
              <p className="border-r-2 text-xs py-2">
                Ph.D in Physics, চট্টগ্রাম বিশ্ববিদ্যালয়
              </p>
              <p className="text-xs py-2">১৮ বছরের অভিজ্ঞতা</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-white w-80 mx-auto shadow-sm">
          <div className="relative">
            <figure>
              <Image src={teacher} alt="Bright Academic Care" />
            </figure>
            <p className="bg-[#F68319] block w-max px-5 rounded-full text-[16px] py-1 absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white">
              ইংরেজি শিক্ষক
            </p>
          </div>
          <div className="card-body px-0">
            <h2 className="card-title text-2xl mx-auto">নাসির উদ্দিন আহমেদ</h2>
            <div className="flex items-center gap-2.5 justify-center mt-2">
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
              <div className="w-2 h-2 bg-[#F68319] rounded-full"></div>
              <div className="w-8 h-0.5 bg-[#F68319]"></div>
            </div>
            <div className="border-t-2 border-b-2 grid grid-cols-2 justify-items-center px-2.5 mt-5">
              <p className="border-r-2 py-2 text-xs">
                M.A in English, রাজশাহী বিশ্ববিদ্যালয়
              </p>
              <p className="text-xs py-2">১০ বছরের অভিজ্ঞতা</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
