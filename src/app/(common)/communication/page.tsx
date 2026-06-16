import React from "react";
import PageHeader from "../_components/PageHeader";
import ContactInfo from "./_components/ContactInfo";
import ContactForm from "./_components/ContactForm";
import MapSection from "./_components/MapSection";

const Communicationpage = () => {
  return (
    <div>
      <PageHeader title="যোগাযোগ করুন" breadcrumbs={["Home", "যোগাযোগ করুন"]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContactInfo />
        <ContactForm />
        <MapSection />
      </div>
    </div>
  );
};

export default Communicationpage;
