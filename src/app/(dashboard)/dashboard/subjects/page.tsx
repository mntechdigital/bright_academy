import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import SubjectsTable from "./_components/SubjectsTable";

const SubjectsDashboardPage = () => {
  return (
    <DashboardWrapper>
      <SubjectsTable />
    </DashboardWrapper>
  );
};

export default SubjectsDashboardPage;
