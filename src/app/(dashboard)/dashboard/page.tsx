import React from "react";
import { DashboardWrapper } from "./_components/DashboardWrapper";
import DashboardOverview from "./_components/DashboardOverview";
import TeacherManagement from "./_components/TeacherManagement";
import StudentTable from "./_components/StudentTable";

const DashboardPage = () => {
  return (
    <DashboardWrapper>
      <DashboardOverview />
      <TeacherManagement/>
      <StudentTable/>
    </DashboardWrapper>
  );
};

export default DashboardPage;
