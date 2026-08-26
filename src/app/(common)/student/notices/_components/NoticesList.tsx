"use client";

import React from "react";
import { ExternalLink, Download, Calendar, FileText } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  pdfUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const NoticesList = ({ noticesData = [] }: { noticesData?: Notice[] }) => {
  if (noticesData.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No notices available
        </h3>
        <p className="mt-2 text-gray-500">
          Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {noticesData.map((notice) => (
        <div
          key={notice.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {notice.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(notice.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={notice.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View PDF
              </a>
              <a
                href={notice.pdfUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-medium hover:bg-[#EA580C] transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticesList;
