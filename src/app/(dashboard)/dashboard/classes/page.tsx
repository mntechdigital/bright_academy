import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import ClassManagement from "./_components/ClassManagement";
import { getClasses } from "@/src/services/classes";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

const StudentClassesPage = async (props: {
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
  ];
  const studentClassData = await getClasses(query);
  return (
    <DashboardWrapper>
      <ClassManagement studentClassData={studentClassData?.data?.data} />
      {studentClassData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={studentClassData?.data?.meta?.totalPages || 1}
          totalItems={studentClassData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default StudentClassesPage;
