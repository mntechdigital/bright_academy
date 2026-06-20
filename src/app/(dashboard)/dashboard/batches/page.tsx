import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import BatchManagement from "./_components/BatchManagement";
import { getBatches } from "@/src/services/batches";
import { TQuery } from "@/src/types/query.types";
import PaginationWrapper from "@/src/components/PaginationWrapper";

const BatchesPage = async (props: {
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
      value: "10",
    },
  ];
  
  let batchData: any = { data: { data: [] } };
  try {
    const response = await getBatches(query);
    batchData = response;
  } catch (error) {
    console.error("Failed to fetch batches:", error);
  }
  
  return (
    <DashboardWrapper>
      <BatchManagement batchData={batchData?.data?.data || []} />
      {batchData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={batchData?.data?.meta?.totalPages || 1}
          totalItems={batchData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default BatchesPage;
