import React from "react";
import PageHeader from "../_components/PageHeader";
import NewsSection from "./_components/NewsSection";

const page = () => {
  return (
    <div>
        <PageHeader title="সংবাদ" breadcrumbs={["Home", "সংবাদ"]} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NewsSection/>
        </div>
      </div>
  );
};

export default page;
