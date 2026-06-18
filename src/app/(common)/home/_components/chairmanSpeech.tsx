import React from "react";
import teacher from "../../../../assets/teacher/teacher.png";
import Image from "next/image";
import gaolIcon from "../../../../assets/about-icon/goal icon.png";

const ChairmanSpeech = () => {
  return (
    <div className="mt-20">
      <h4 className="block w-fit mx-auto bg-white text-[#2B2B2B] px-4 py-1 border-l-2 border-l-[#f81717] inset-shadow-sm">
        পরিচালকের বাণী
      </h4>

      <div className="grid grid-cols-none md:grid-cols-2 place-items-center mt-20">
        <div>
          <div className="card bg-white w-88 mx-auto shadow-sm">
            <figure>
              <Image src={teacher} alt="Bright Academic Care" />
            </figure>

            <div className="card-body px-0">
              <h2 className="card-title text-2xl mx-auto">
                নাসির উদ্দিন আহমেদ
              </h2>
              <div className="flex items-center gap-2.5 justify-center mt-2">
                <div className="w-8 h-0.5 bg-[#F68319]"></div>
                <div className="w-2 h-2 bg-[#F68319] rounded-full"></div>
                <div className="w-8 h-0.5 bg-[#F68319]"></div>
              </div>
              <hr />
              <p className="mt-2 pl-2">B.Com (Hon’s); M.Com</p>
            </div>
          </div>
        </div>

        <div>
          <div className="border-2 flex flex-col md:flex-row justify-items-center justify-center px-3.5 py-5 gap-7 rounded-2xl items-center md:items-start mt-8 mx-5">
            <Image
              src={gaolIcon}
              alt="Bright Academic Care"
              className="w-12 h-12"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[28px] font-semibold text-center md:text-start mb-3">
                  পরিচালকের বাণী
                </h1>
                <hr className="w-[20%] h-1" />
              </div>
              <p className="text-sm leading-6 text-center md:text-start">
                ব্রাইট একাডেমি মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা
                বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা।
                আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।
              </p>
            </div>
          </div>
          <div className="border-2 flex flex-col md:flex-row justify-items-center justify-center px-3.5 py-5 gap-7 rounded-2xl items-center md:items-start mt-2 mx-5">
            <Image
              src={gaolIcon}
              alt="Bright Academic Care"
              className="w-12 h-12"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[28px] font-semibold text-center md:text-start mb-3">
                  পরিচালকের বাণী
                </h1>
                <hr className="w-[20%] h-1" />
              </div>
              <p className="text-sm leading-6 text-center md:text-start">
                ব্রাইট একাডেমি মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা
                বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা।
                আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।
              </p>
            </div>
          </div>
          <div className="border-2 flex flex-col md:flex-row justify-items-center justify-center px-3.5 py-5 gap-7 rounded-2xl items-center md:items-start mt-2 mx-5">
            <Image
              src={gaolIcon}
              alt="Bright Academic Care"
              className="w-12 h-12"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[28px] font-semibold text-center md:text-start mb-3">
                  পরিচালকের বাণী
                </h1>
                <hr className="w-[20%] h-1" />
              </div>
              <p className="text-sm leading-6 text-center md:text-start">
                ব্রাইট একাডেমি মূল লক্ষ্য হলো প্রতিটি শিক্ষার্থীর সুপ্ত প্রতিভা
                বিকশিত করা এবং তাদের একাডেমিক ও ব্যক্তিত্ব উন্নয়নে সহায়তা করা।
                আমরা বিশ্বাস করি যে প্রতিটি শিশুর মধ্যে অসীম সম্ভাবনা রয়েছে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChairmanSpeech;
