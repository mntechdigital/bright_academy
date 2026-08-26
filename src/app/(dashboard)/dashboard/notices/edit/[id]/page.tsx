import EditPageProps from "@/src/types/params.interface";
import React from "react";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import EditNoticeForm from "./_components/EditNoticeForm";

const NoticeUpdatePage = async ({ params }: EditPageProps) => {
  const { id } = await params;

  return (
    <DashboardWrapper>
      <EditNoticeForm noticeId={id} />
    </DashboardWrapper>
  );
};

export default NoticeUpdatePage;
