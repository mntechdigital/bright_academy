import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import RoutineForm from "../../_components/RoutineForm";

const EditRoutinePage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const params = await props.params;

  return (
    <DashboardWrapper>
      <RoutineForm routineId={params.id} />
    </DashboardWrapper>
  );
};

export default EditRoutinePage;
