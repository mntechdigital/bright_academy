import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import StudentManagement from "./_components/StudentManagement";
import { getStudents } from "@/src/services/students";
import { getClasses } from "@/src/services/classes";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const StudentsPage = async (props: {
  searchParams: Promise<{
    search: string;
    page: string;
    class?: string;
    classId?: string;
    batch?: string;
    batchId?: string;
    gender?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const classFilterRaw = searchParams.class || searchParams.classId || "";
  const batchFilterRaw = searchParams.batch || searchParams.batchId || "";
  const genderFilter = searchParams.gender || "";

  const classQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  // Fetch classes first to map any name-based filters (?class=class-7&batch=B-4) to IDs
  // Deployed Vercel backend only honors filter JSON with classId/batchId (uuid), not direct ?class= names
  const classesDataRes = await getClasses(classQuery);
  const classesData = classesDataRes?.data?.data || [];

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let classIdForFilter = "";
  if (classFilterRaw) {
    if (uuidRegex.test(classFilterRaw)) classIdForFilter = classFilterRaw;
    else {
      const found = classesData.find((c: any) => c.className === classFilterRaw || c.id === classFilterRaw);
      if (found) classIdForFilter = found.id;
    }
  }
  let batchIdForFilter = "";
  if (batchFilterRaw) {
    if (uuidRegex.test(batchFilterRaw)) batchIdForFilter = batchFilterRaw;
    else {
      // Batch names are per-class (B-4 exists in many classes) — scope to selected class if present
      let batches: any[] = [];
      if (classIdForFilter) {
        const cls = classesData.find((c: any) => c.id === classIdForFilter);
        batches = cls?.batches || [];
      } else {
        batches = classesData.flatMap((c: any) => c.batches || []);
      }
      const found = batches.find((b: any) => b.name === batchFilterRaw);
      if (found) batchIdForFilter = found.id;
    }
  }

  const query: TQuery[] = [
    { key: "orderBy", value: JSON.stringify({ createdAt: "desc" }) },
    { key: "searchTerm", value: search },
    { key: "page", value: page.toString() },
    { key: "limit", value: "10" },
  ];

  // Build filter JSON for Vercel backend (requires classId/batchId uuid) — primary path that actually filters
  const filter: Record<string, string> = {};
  if (classIdForFilter) filter.classId = classIdForFilter;
  if (batchIdForFilter) filter.batchId = batchIdForFilter;
  if (genderFilter && genderFilter !== "All") filter.gender = genderFilter;
  if (Object.keys(filter).length > 0) {
    query.push({ key: "filter", value: JSON.stringify(filter) });
  }
  // Also forward direct params for local new backend (handles names + ids via stdClass/batch relation + mode insensitive)
  // This ensures both deployed (filter JSON) and local (direct) backends filter correctly
  if (classFilterRaw) query.push({ key: "class", value: classFilterRaw });
  if (batchFilterRaw) query.push({ key: "batch", value: batchFilterRaw });
  if (genderFilter && genderFilter !== "All") query.push({ key: "gender", value: genderFilter });

  const studentsData = await getStudents(query);

  return (
    <DashboardWrapper>
      <StudentManagement 
        studentsData={studentsData?.data?.data} 
        classesData={classesData}
        totalStudents={studentsData?.data?.meta?.totalItems || 0}
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
