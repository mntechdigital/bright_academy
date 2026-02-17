import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import StudentManagement from "./_components/StudentManagement";
import { getStudents } from "@/src/services/students";
import { getClasses } from "@/src/services/classes";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

const StudentsPage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "desc" }),
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
      value: "10",
    },
  ];
  
  const classQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  const [studentsData, classesData] = await Promise.all([
    getStudents(query),
    getClasses(classQuery),
  ]);

  return (
    <DashboardWrapper>
      <StudentManagement 
        studentsData={studentsData?.data?.data} 
        classesData={classesData?.data?.data}
      />
      {studentsData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={studentsData?.data?.meta?.totalPages || 1}
          totalItems={studentsData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default StudentsPage;
