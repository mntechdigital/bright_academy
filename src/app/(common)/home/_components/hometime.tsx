import React from "react";
import bg from "../../../../assets/hometime/bg.png";

const Hometime = () => {
  return (
    <div
      className="relative w-full h-[60vh] md:h-[80vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div className="relative z-20">
        <h4 className="block w-fit mx-auto md:mx-0 bg-white text-[#2B2B2B]  px-4 py-1 border-l-2 border-l-[#f81717]">
          নির্ধারিত সময়
        </h4>
        <h1 className="text-white text-center font-semibold text-[28px] leading-9 mt-5">
          বিভিন্ন শ্রেণির জন্য নির্ধারিত সময়
        </h1>
      </div>
    </div>
  );
};

export default Hometime;
