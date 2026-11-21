import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditPageProps from "@/src/types/params.interface";
import { getMonthlyResultById } from "@/src/services/monthlyResult";
import { getSubjects } from "@/src/services/subjects";
import UpdateResultForm from "./_components/UpdateResultForm";

const EditMonthlyResultpage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const getMonthlyResultRes = await getMonthlyResultById(id);
  const result = getMonthlyResultRes?.data;
  const classId = result?.classId || result?.student?.classId;
  const subjectsRes = classId
    ? await getSubjects([
        { key: "filter", value: JSON.stringify({ classId }) },
        { key: "limit", value: "100" },
      ])
    : null;
  const classSubjects = Array.isArray(subjectsRes?.data?.data)
    ? subjectsRes.data.data
    : Array.isArray(subjectsRes?.data)
      ? subjectsRes.data
      : [];
  return (
    <DashboardWrapper>
      <UpdateResultForm result={result} classSubjects={classSubjects} />
    </DashboardWrapper>
  );
};

export default EditMonthlyResultpage;
