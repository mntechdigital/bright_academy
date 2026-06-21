import EditPageProps from "@/src/types/params.interface";
import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditBatchForm from "./_components/EditBatchForm";

const BatchUpdatePage = async ({ params }: EditPageProps) => {
  const { id } = await params;

  return (
    <DashboardWrapper>
      <EditBatchForm batchId={id} />
    </DashboardWrapper>
  );
};

export default BatchUpdatePage;