import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import BatchManagement from "./_components/BatchManagement";
import { getBatches } from "@/src/services/batches";
import { getStudents } from "@/src/services/students";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

const BatchesPage = async (props: {
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
  
  let batchData: any = { data: { data: [] } };
  let studentData: any = { data: { data: [] } };
  
  try {
    const [batchResponse, studentResponse] = await Promise.all([
      getBatches(query),
      getStudents([{ key: "limit", value: "1000" }])
    ]);
    batchData = batchResponse;
    studentData = studentResponse;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  
  // Count students by batchId
  const studentCountByBatch: Record<string, number> = {};
  studentData?.data?.data?.forEach((student: any) => {
    if (student.batchId) {
      studentCountByBatch[student.batchId] = (studentCountByBatch[student.batchId] || 0) + 1;
    }
  });
  
  // Add student count to each batch
  const batchesWithCount = batchData?.data?.data?.map((batch: any) => ({
    ...batch,
    studentCount: studentCountByBatch[batch.id] || 0,
  })) || [];
  
  return (
    <DashboardWrapper>
      <BatchManagement batchData={batchesWithCount} />
    </DashboardWrapper>
  );
};

export default BatchesPage;
