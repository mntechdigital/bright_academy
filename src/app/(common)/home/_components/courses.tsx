import React from "react";
import bg from "../../../../assets/hometime/bg.png";
import courseImage from "../../../../assets/coures/BG.png";
import Image from "next/image";

const Courses = () => {
  return (
    <div
      className="relative w-full bg-cover bg-center bg-no-repeat flex items-center justify-center py-12.5 md:py-20 mt-24"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div className="relative z-20">
        <h4 className="block w-fit mx-auto bg-white text-[#2B2B2B]  px-4 py-1 border-l-2 border-l-[#f81717]">
          নির্ধারিত সময়
        </h4>
        <h1 className="text-white text-center font-semibold text-[28px] leading-9 mt-5">
          বিভিন্ন শ্রেণির জন্য নির্ধারিত সময়
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:px-16 mt-10">
          <div className="card bg-white w-90 md:w-70 mx-auto shadow-sm rounded-3xl">
            <figure>
              <Image
                src={courseImage}
                alt="Bright Academic Care"
                className="w-full"
              />
            </figure>
            <div className="card-body px-5">
              <h2 className="card-title text-2xl ">৫ম -১০ম শ্রেণি</h2>

              <div className="bg-[#F68319] p-2.5 rounded-3xl grid grid-cols-2 items-center w-full">
                <p className="text-[14px] font-semibold text-white text-left">
                  সময়
                </p>
                <p className="text-[14px] font-semibold text-white text-right">
                  সকাল ৭ টা -১০ টা
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-white w-90 md:w-70 mx-auto shadow-sm rounded-3xl">
            <figure>
              <Image
                src={courseImage}
                alt="Bright Academic Care"
                className="w-full"
              />
            </figure>
            <div className="card-body px-5">
              <h2 className="card-title text-2xl ">৩য় -১০ম শ্রেণি</h2>

              <div className="bg-[#F68319] p-2.5 rounded-3xl grid grid-cols-2 items-center w-full">
                <p className="text-[14px] font-semibold text-white text-left">
                  সময়
                </p>
                <p className="text-[14px] font-semibold text-white text-right">
                  সকাল ৯ টা -১২ টা
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-white w-90 md:w-70  mx-auto shadow-sm rounded-3xl">
            <figure>
              <Image
                src={courseImage}
                alt="Bright Academic Care"
                className="w-full"
              />
            </figure>
            <div className="card-body px-5">
              <h2 className="card-title text-2xl ">৩য় -১২ শ্রেণি</h2>

              <div className="bg-[#F68319] p-2.5 rounded-3xl grid grid-cols-2 items-center w-full">
                <p className="text-[14px] font-semibold text-white text-left">
                  সময়
                </p>
                <p className="text-[14px] font-semibold text-white text-right">
                  দুপুর ২টা -0৫ টা
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-white w-90 md:w-70  mx-auto shadow-sm rounded-3xl">
            <figure>
              <Image
                src={courseImage}
                alt="Bright Academic Care"
                className="w-full"
              />
            </figure>
            <div className="card-body px-5">
              <h2 className="card-title text-2xl ">৩য় -১২ শ্রেণি</h2>

              <div className="bg-[#F68319] p-2.5 rounded-3xl grid grid-cols-2 items-center w-full">
                <p className="text-[16px] font-semibold text-white text-left">
                  সময়
                </p>
                <p className="text-[16px] font-semibold text-white text-right">
                  বিকাল ৫টা -৮ টা
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
