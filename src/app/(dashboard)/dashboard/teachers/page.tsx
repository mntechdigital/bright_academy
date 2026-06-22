import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import TeacherTable from "./_components/TeacherTable";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { getTeachers } from '@/src/services/teacher';

const page = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;

  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ regNo: "asc" }),
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
  const teacherData = await getTeachers(query);
  return (
    <DashboardWrapper>
      <div className="p-4 rounded-lg shadow-s border-2 border-gray-100">
        <TeacherTable teacherData={teacherData?.data || []} />
        {teacherData?.meta?.totalPages > 1 && (
          <PaginationWrapper
            active={page}
            totalPages={teacherData?.meta?.totalPages || 1}
            totalItems={teacherData?.meta?.totalItems || 0}
          />
        )}
      </div>
    </DashboardWrapper>
  );
};

export default page;
