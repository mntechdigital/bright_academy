"use client";
import Link from "next/link";
import React, { useState } from "react";

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const GradeIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 7h6M9 11h6M9 15h4"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const PencilIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const students = [
  {
    name: "Percy Bysshe Shelley",
    username: "@shelley",
    id: "right0191",
    section: "A",
    totalMark: 600,
    achievedMark: 550,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Lord Byron",
    username: "@byron",
    id: "right0192",
    section: "A",
    totalMark: 600,
    achievedMark: 550,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Emily Elizabeth Dickinson",
    username: "@emily",
    id: "right0193",
    section: "B",
    totalMark: 600,
    achievedMark: 550,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Mary Wollstonecraft Shelley",
    username: "@mary",
    id: "right0194",
    section: "B",
    totalMark: 600,
    achievedMark: 550,
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Elizabeth Barrett Browning",
    username: "@elizabeth",
    id: "right0195",
    section: "B",
    totalMark: 600,
    achievedMark: 550,
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];

export default function ShowMonthlyResultTable(monthlyResultsData: any) {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleAll = () => {
    const next = !checkedAll;
    setCheckedAll(next);
    const newChecked: Record<string, boolean> = {};
    students.forEach((s) => (newChecked[s.id] = next));
    setChecked(newChecked);
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="">
      {/* Page Header */}
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Result</h1>
        <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full">
          Class 6
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          {/* Left: Search + Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-52">
              <svg
                className="w-4 h-4 text-gray-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for students"
                className="text-sm text-gray-700 bg-transparent outline-none w-full placeholder-gray-400"
              />
            </div>

            {/* Dropdowns */}
            {["Select Class", "Select Section", "Select Exam"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between gap-6 border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer min-w-32.5 text-sm text-gray-500 select-none"
              >
                <span>{label}</span>
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download CSV
            </button>
            <Link
              href="/dashboard/result/give-result"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Give Result
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left w-9">
                  <input
                    type="checkbox"
                    checked={checkedAll}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Student's Name
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Student's ID
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Section
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Total Mark
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16v-4m0-4h.01"
                      />
                    </svg>
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Achieved Mark
                </th>
                <th className="px-3 py-2.5 text-left text-gray-500 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-3 py-3.5">
                    <input
                      type="checkbox"
                      checked={!!checked[student.id]}
                      onChange={() => toggleOne(student.id)}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {student.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {student.id}
                    </span>
                  </td>

                  {/* Section */}
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {student.section}
                    </span>
                  </td>

                  {/* Total Mark */}
                  <td className="px-3 py-3.5 text-gray-700 font-medium">
                    {student.totalMark}
                  </td>

                  {/* Achieved Mark */}
                  <td className="px-3 py-3.5 text-gray-700 font-medium">
                    {student.achievedMark}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Grade"
                      >
                        <GradeIcon />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
