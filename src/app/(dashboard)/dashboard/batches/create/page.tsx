import React from "react";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import CreateBatch from "./_components/CreateBatch";
import { getClasses } from "@/src/services/classes";

const CreateBatchPage = async () => {
  const classQuery = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  let classesData: any = { data: { data: [] } };
  try {
    const response = await getClasses(classQuery);
    classesData = response;
  } catch (error) {
    console.error("Failed to fetch classes:", error);
  }

  return (
    <DashboardWrapper>
      <CreateBatch classesData={classesData?.data?.data || []} />
    </DashboardWrapper>
  );
};

export default CreateBatchPage;
