import React from "react";
import { DashboardWrapper } from "./_components/DashboardWrapper";
import DashboardOverview from "./_components/DashboardOverview";
import TeacherTable from "./teachers/_components/TeacherTable";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";
import { getTeachers } from "@/src/services/teacher";
import { getStudents } from "@/src/services/students";
import { getClasses } from "@/src/services/classes";
import StudentManagement from "./students/_components/StudentManagement";

const DashboardPage = async (props: {
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

  const teacherData = await getTeachers(query);

  const totalStudents = studentsData?.data?.meta?.totalItems || 0;
  const totalTeachers = teacherData?.meta?.totalItems || 0;
  const totalClasses = classesData?.data?.meta?.totalItems || 0;

  return (
    <DashboardWrapper>
      <DashboardOverview
        totalTeachers={totalTeachers}
        totalStudents={totalStudents}
        totalClasses={totalClasses}
      />
      {/* teacher overview */}
      <div className="p-4 rounded-lg shadow-s border-2 border-gray-100 my-6">
        <TeacherTable teacherData={teacherData?.data || []} />
        {teacherData?.meta?.totalPages > 1 && (
          <PaginationWrapper
            active={page}
            totalPages={teacherData?.meta?.totalPages || 1}
            totalItems={teacherData?.meta?.totalItems || 0}
          />
        )}
      </div>
      {/* student overview */}
      <div>
        <StudentManagement
          studentsData={studentsData?.data?.data || []}
          classesData={classesData?.data?.data || []}
        />
        {studentsData?.data?.meta?.totalPages > 1 && (
          <PaginationWrapper
            active={page}
            totalPages={studentsData?.data?.meta?.totalPages || 1}
            totalItems={studentsData?.data?.meta?.totalItems || 0}
          />
        )}
      </div>
    </DashboardWrapper>
  );
};

export default DashboardPage;
