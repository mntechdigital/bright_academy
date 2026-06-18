import React from "react";

const NewsUpdate = () => {
  return (
    <div className="mt-12.5">
      <h4 className="block w-fit mx-auto bg-white text-[#2B2B2B] px-4 py-1 border-l-2 border-l-[#f81717] inset-shadow-sm">
        সংবাদ ও ঘোষণা
      </h4>
      <h1 className="text-black  text-center font-semibold text-[28px] md:text-[32px] leading-9 mt-5 px-5">
        পরিকল্পনা আপডেট এবং গুরুত্বপূর্ণ তথ্য
      </h1>

      <div className=" md:grid grid-cols-3 justify-between">
        <div className="mt-5 shadow-xl mx-5 rounded-3xl">
          <div className="px-4 py-7.5">
            <div className="flex items-center gap-4">
              <h3 className="text-xl text-[#F68319] font-medium">তথ্য</h3>
              <hr className="h-1 w-[50%]" />
            </div>
            <h3 className="text-2xl text-[#2B2B2B] font-semibold mt-2.5">
              নতুন কম্পিউটার ল্যাব
            </h3>
            <hr className="mt-4" />
            <p className="text-sm leading-7 mt-5">
              ইসলাম ল্যাব স্থাপন করা হয়েছে। সাম্প্রতিক প্রযুক্তি দ্বারা সজ্জিত।
            </p>
          </div>
        </div>
        <div className="mt-5 shadow-xl mx-5 rounded-3xl">
          <div className="px-4 py-7.5">
            <div className="flex items-center gap-4">
              <h3 className="text-xl text-[#F68319] font-medium">সাফল্য</h3>
              <hr className="h-1 w-[50%]" />
            </div>
            <h3 className="text-2xl text-[#2B2B2B] font-semibold mt-2.5">
              JSC/SSC ফলাফল
            </h3>
            <hr className="mt-4" />
            <p className="text-sm leading-7 mt-5">
              আমাদের ৯৫% জেএসসি ও এসএসসি পরীক্ষায় A+ গ্রেড অর্জন করেছে।
              অভিনন্দন গোল!
            </p>
          </div>
        </div>
        <div className="mt-5 shadow-xl mx-5 rounded-3xl">
          <div className="px-4 py-7.5">
            <div className="flex items-center gap-4">
              <h3 className="text-xl text-[#F68319] font-medium">জরুরী</h3>
              <hr className="h-1 w-[50%]" />
            </div>
            <h3 className="text-2xl text-[#2B2B2B] font-semibold mt-2.5">
              নতুন ব্যাচ ভর্তি শুরু
            </h3>
            <hr className="mt-4" />
            <p className="text-sm leading-7 mt-5">
              ২০২৫ সালের নতুন শিক্ষাবর্ষের জন্য সকল ক্লাসে ভর্তি চলছে। সীমিত
              আসন। তাড়াতাড়ি যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsUpdate;
