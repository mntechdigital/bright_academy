import EditPageProps from "@/src/types/params.interface";
import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditSubjectForm from "./_components/EditSubjectForm";

const SubjectUpdatePage = async ({ params }: EditPageProps) => {
  const { id } = await params;

  return (
    <DashboardWrapper>
      <EditSubjectForm subjectId={id} />
    </DashboardWrapper>
  );
};

export default SubjectUpdatePage;