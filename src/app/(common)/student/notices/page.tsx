import React from "react";
import { getPublishedNotices } from "@/src/services/notice";
import { TQuery } from "@/src/types/query.types";
import NoticesList from "./_components/NoticesList";

const StudentNoticesPage = async () => {
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "desc" }),
    },
    {
      key: "limit",
      value: "1000",
    },
  ];
  const noticesData = await getPublishedNotices(query);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
          <p className="mt-2 text-gray-600">
            Stay updated with the latest notices from Bright Academy
          </p>
        </div>

        {/* Notices List */}
        <NoticesList noticesData={noticesData?.data?.data || []} />
      </div>
    </div>
  );
};

export default StudentNoticesPage;
