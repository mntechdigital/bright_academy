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

const BatchManagement = ({
  batchData = [],
}: {
  batchData?: any[];
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBatches = batchData.filter((batch) =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log("see batches data==>", batchData);

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
                    Batch Name
                    <HelpCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Class
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Start Time
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  End Time
                </th>
                <th className="px-6 py-5 text-left text-base font-medium text-gray-600 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 lg:px-12 py-6 text-gray-700 font-medium whitespace-nowrap text-base">
                      {batch.name || "N/A"}
                    </td>
                    <td className="px-6 py-6 text-gray-700 whitespace-nowrap text-base">
                      {batch.stdClass?.className || "N/A"}
                    </td>
                    <td className="px-6 py-6 text-gray-700 whitespace-nowrap text-base">
                      {batch.startTime || "N/A"}
                    </td>
                    <td className="px-6 py-6 text-gray-700 whitespace-nowrap text-base">
                      {batch.endTime || "N/A"}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <DeleteBatchDialog id={batch.id} />

                        <Link
                          href={`/dashboard/batches/edit/${batch.id}`}
                          className="text-purple-500 hover:text-purple-600 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
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