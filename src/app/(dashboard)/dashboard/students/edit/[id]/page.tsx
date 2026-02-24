import EditPageProps from "@/src/types/params.interface";
import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditStudentForm from "./_components/EditStudentForm";
import { getClasses } from "@/src/services/classes";
import { TQuery } from "@/src/types/query.types";

const StudentUpdatePage = async ({ params }: EditPageProps) => {
  const { id } = await params;

  const classQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  const classesData = await getClasses(classQuery);

  return (
    <DashboardWrapper>
      <EditStudentForm studentId={id} classesData={classesData?.data?.data} />
    </DashboardWrapper>
  );
};

export default StudentUpdatePage;
