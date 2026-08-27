import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import NoticesTable from "./_components/NoticesTable";
import { getNotices } from "@/src/services/notice";
import { TQuery } from "@/src/types/query.types";

const NoticesDashboardPage = async (props: {
  searchParams: Promise<{ search: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "desc" }),
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
  const noticesData = await getNotices(query);
  return (
    <DashboardWrapper>
      <NoticesTable noticesData={noticesData?.data?.data} />
    </DashboardWrapper>
  );
};

export default NoticesDashboardPage;
