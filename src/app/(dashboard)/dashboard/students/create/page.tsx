import React from "react";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import CreateStudent from "./_components/CreateStudent";
import { getClasses } from "@/src/services/classes";
import { TQuery } from "@/src/types/query.types";

const CreateStudentPage = async () => {
  const classQuery: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "asc" }),
    },
  ];

  const classesData = await getClasses(classQuery);

  return (
    <DashboardWrapper>
      <CreateStudent classesData={classesData?.data?.data} />
    </DashboardWrapper>
  );
};

export default CreateStudentPage;
