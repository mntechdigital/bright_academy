import { PhoneCall } from "lucide-react";
import React from "react";
import Marquee from "react-fast-marquee";

const Topnoticebar = () => {
  return (
    <div>
      <main className="bg-[#F68319] py-1.5">
        <Marquee
          speed={100}
          pauseOnHover={true}
          gradient={true}
          gradientColor="#F68319"
        >
          <h4 className="text-[20px] text-white flex gap-2">
            নতুন ব্যাচ শুরু হচ্ছে! ভর্তি চলছে। সীমিত আসন।{" "}
            <span>
              <PhoneCall />
            </span>{" "}
            কল করুন: ০১৭১৬৬১১২০৮
          </h4>
        </Marquee>
      </main>
    </div>
  );
};

export default Topnoticebar;
