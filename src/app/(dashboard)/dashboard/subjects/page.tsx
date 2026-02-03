import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import SubjectsTable from "./_components/SubjectsTable";
import { getSubjects } from "@/src/services/subjects";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

const SubjectsDashboardPage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
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
      key: "page",
      value: page.toString(),
    },
    {
      key: "limit",
      value: "4",
    },
  ];
  const subjectsData = await getSubjects(query);
  return (
    <DashboardWrapper>
      <SubjectsTable subjectsData={subjectsData?.data?.data} />
      {subjectsData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={subjectsData?.data?.meta?.totalPages || 1}
          totalItems={subjectsData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default SubjectsDashboardPage;
