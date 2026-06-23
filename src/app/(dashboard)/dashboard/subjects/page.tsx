import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import SubjectsTable from "./_components/SubjectsTable";
import { getSubjects } from "@/src/services/subjects";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

const SubjectsDashboardPage = async (props: {
  searchParams: Promise<{ search: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
    {
      key: "searchTerm",
      value: search,
    },
    {
      key: "limit",
      value: "1000",
    },
  ];
  const subjectsData = await getSubjects(query);
  return (
    <DashboardWrapper>
      <SubjectsTable subjectsData={subjectsData?.data?.data} />
    </DashboardWrapper>
  );
};

export default SubjectsDashboardPage;
