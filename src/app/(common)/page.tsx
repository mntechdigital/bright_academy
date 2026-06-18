import React from "react";
import HeroSection from "./home/_components/heroSection";
import AboutSection from "@/src/components/aboutSection";
import Courses from "./home/_components/courses";
import Teachers from "./home/_components/teachers";
import StudentsReview from "./home/_components/studentsReview";
import NewsUpdate from "./home/_components/newsUpdate";
import ChairmanSpeech from "./home/_components/chairmanSpeech";
import Topnoticebar from "@/src/components/topnoticebar";

const Home = () => {
  return (
    <div>
      <Topnoticebar />
      <HeroSection />
      <AboutSection />
      <Courses />
      <ChairmanSpeech />
      <Teachers />
      <StudentsReview />
      <NewsUpdate />
    </div>
  );
};

export default Home;
