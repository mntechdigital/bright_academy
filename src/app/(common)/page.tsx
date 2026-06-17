import React from "react";
import HeroSection from "./home/_components/heroSection";
import AboutSection from "@/src/components/aboutSection";
import Hometime from "./home/_components/hometime";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <Hometime/>
    </div>
  );
};

export default Home;
