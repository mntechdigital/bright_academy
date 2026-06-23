import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import BatchManagement from "./_components/BatchManagement";
import { getBatches } from "@/src/services/batches";
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
  try {
    const response = await getBatches(query);
    batchData = response;
  } catch (error) {
    console.error("Failed to fetch batches:", error);
  }
  
  return (
    <DashboardWrapper>
      <BatchManagement batchData={batchData?.data?.data || []} />
    </DashboardWrapper>
  );
};

export default BatchesPage;
