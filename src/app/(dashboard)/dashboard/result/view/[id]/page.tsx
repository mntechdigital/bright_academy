import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditPageProps from "@/src/types/params.interface";
import { getMonthlyResultById } from "@/src/services/monthlyResult";
import ViewMonthlyResultForm from "./_components/ViewMonthlyResultForm";

const ViewResutlPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const getMonthlyResultRes = await getMonthlyResultById(id);
  return (
    <DashboardWrapper>
      <ViewMonthlyResultForm result={getMonthlyResultRes.data} />
    </DashboardWrapper>
  );
};

export default ViewResutlPage;
