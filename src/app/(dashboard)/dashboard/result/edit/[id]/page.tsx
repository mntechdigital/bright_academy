import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditPageProps from "@/src/types/params.interface";
import {
  getMonthlyResultById,
  updateMonthlyResult,
} from "@/src/services/monthlyResult";
import UpdateResultForm from "./_components/UpdateResultForm";

const EditMonthlyResultpage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const getMonthlyResultRes = await getMonthlyResultById(id);
  console.log("single result==>", getMonthlyResultRes.data);
  return (
    <DashboardWrapper>
      <UpdateResultForm result={getMonthlyResultRes.data} />
    </DashboardWrapper>
  );
};

export default EditMonthlyResultpage;
