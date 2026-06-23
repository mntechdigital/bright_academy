"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import DeleteBatchDialog from "./DeleteBatchDialog";

const formatTime = (time: string) => {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

interface Batch {
  id: string;
  name: string;
  classId: string;
  stdClass: {
    id: string;
    className: string;
    createdAt: string;
    updatedAt: string;
  };
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedClass {
  classId: string;
  className: string;
  batches: Batch[];
  createdAt: string;
}

const BatchManagement = ({
  batchData = [],
}: {
  batchData?: Batch[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatches = batchData.filter((batch) =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group batches by class
  const groupedByClass = filteredBatches.reduce<Record<string, GroupedClass>>(
    (acc, batch) => {
      const classId = batch.classId;
      if (!acc[classId]) {
        acc[classId] = {
          classId,
          className: batch.stdClass?.className || "N/A",
          batches: [],
          createdAt: batch.createdAt,
        };
      }
      acc[classId].batches.push(batch);
      return acc;
    },
    {},
  );

  const groupedData = Object.values(groupedByClass).sort((a, b) => {
    const numA = parseInt(a.className.replace(/\D/g, "")) || 0;
    const numB = parseInt(b.className.replace(/\D/g, "")) || 0;
    return numA - numB;
  });

  return (
    <div className="">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900">Batches</h1>
            <span className="text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-full text-md">
              Bright Academy
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6 my-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for batches"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-2/3 md:justify-end">
              <Link
                href="/dashboard/batches/create"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap text-base font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Create Batch</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-225">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 lg:px-12 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Class Name
                    <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Batches
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupedData.length > 0 ? (
                groupedData.map((cls) => (
                  <tr
                    key={cls.classId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                      {cls.className}
                    </td>
                    <td className="px-6 py-6 text-gray-600 text-base">
                      <div className="flex flex-wrap gap-2">
                        {cls?.batches?.map((batch) => (
                          <span
                            key={batch.id}
                            className="group inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium"
                          >
                            {batch.name}
                            <span className="text-purple-400">
                              ({formatTime(batch.startTime)} - {formatTime(batch.endTime)})
                            </span>
                            <Link
                              href={`/dashboard/batches/edit/${batch.id}`}
                              className="hidden group-hover:inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200 transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Link>
                            <DeleteBatchDialog id={batch.id} />
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-gray-600 whitespace-nowrap text-base">
                      {cls.createdAt
                        ? new Date(cls.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500 text-base"
                  >
                    No batches found
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

export default BatchManagement;