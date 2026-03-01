import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import UpdateTeacherPassword from "./_components/UpdateTeacherPassword";
import { getTeacherById } from "@/src/services/teacher";
import EditPageProps from "@/src/types/params.interface";

const TeacherUpdatePasswordPage = async ({ params }: EditPageProps) => {
  const { id } = await params;
  const teacherRes = await getTeacherById(id);
  const teacher = teacherRes?.data;

  return (
    <DashboardWrapper>
      <UpdateTeacherPassword teacher={teacher} />
    </DashboardWrapper>
  );
};

export default TeacherUpdatePasswordPage;
