import React from "react";
import HeroSection from "./home/_components/heroSection";
import AboutSection from "@/src/components/aboutSection";
import Hometime from "./home/_components/hometime";
import Teachers from "./home/_components/teachers";
import StudentsReview from "./home/_components/studentsReview";
import NewsUpdate from "./home/_components/newsUpdate";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <Hometime />
      <Teachers />
      <StudentsReview />
      <NewsUpdate />
    </div>
  );
};

export default Home;
