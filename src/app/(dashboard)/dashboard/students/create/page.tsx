import React from "react";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import CreateStudent from "./_components/CreateStudent";
import { getClasses } from "@/src/services/classes";
import { getBatches } from "@/src/services/batches";
import { TQuery } from "@/src/types/query.types";

const CreateStudentPage = async () => {
  const classQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  const classesData = await getClasses(classQuery);

  const batchQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  const batchesData = await getBatches(batchQuery);

  return (
    <DashboardWrapper>
      <CreateStudent 
        classesData={classesData?.data?.data} 
        batchesData={batchesData?.data?.data} 
      />
    </DashboardWrapper>
  );
};

export default CreateStudentPage;
