"use client";

import React, { useState } from "react";
import { Search, Plus, ExternalLink, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteNoticeDialog from "./DeleteNoticeDialog";

interface Notice {
  id: string;
  title: string;
  pdfUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const NoticesTable = ({ noticesData = [] }: { noticesData?: Notice[] }) => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    router.push(
      `/dashboard/notices?search=${encodeURIComponent(search)}&page=1`,
    );
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900">Notices</h1>
            <span className="text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-full text-md">
              Bright Academy
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6 my-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search for notices"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
                />
              </div>
            </form>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3 md:justify-end">
              <Link
                href="/dashboard/notices/create"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Notice</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 lg:px-12 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Title
                    <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  PDF Link
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Created Date
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {noticesData.length > 0 ? (
                noticesData.map((notice) => (
                  <tr
                    key={notice.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                      {notice.title}
                    </td>
                    <td className="px-6 py-6 text-gray-600 text-base">
                      <a
                        href={notice.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View PDF
                      </a>
                    </td>
                    <td className="px-6 py-6 text-gray-600 text-base">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notice.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notice.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-gray-600 text-base whitespace-nowrap">
                      {new Date(notice.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-6 text-base">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/notices/edit/${notice.id}`}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </Link>
                        <DeleteNoticeDialog id={notice.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 text-base"
                  >
                    No notices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NoticesTable;
