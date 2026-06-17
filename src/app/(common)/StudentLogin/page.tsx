import React from "react";
import StudentLogin from "./_components/StudentLogin";
import PageHeader from "../_components/PageHeader";

const page = () => {
  return (
    <div>
      <PageHeader
        title="Student Login"
        breadcrumbs={["Home", "Student Login"]}
      />
      <StudentLogin />
    </div>
  );
};

export default page;
