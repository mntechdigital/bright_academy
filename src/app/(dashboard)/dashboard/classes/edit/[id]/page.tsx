import EditPageProps from "@/src/types/params.interface";
import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditClassesForm from "./_components/EditClassesForm";

const ClassesUpdatepage = async ({ params }: EditPageProps) => {
  const { id } = await params;

  return (
    <DashboardWrapper>
      <EditClassesForm classId={id} />
    </DashboardWrapper>
  );
};

export default ClassesUpdatepage;
