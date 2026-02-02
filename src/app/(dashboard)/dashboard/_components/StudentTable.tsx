"use client";
import React, { useState } from "react";
import {
  Search,
  Download,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
} from "lucide-react";

export default function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedClass, setSelectedClass] = useState("Class 6");
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);

  const students = [
    {
      id: "right0191",
      name: "Percy Bysshe Shelley",
      username: "@shelley",
      section: "A",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0192",
      name: "Lord Byron",
      username: "@byron",
      section: "A",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0193",
      name: "Emily Elizabeth Dickinson",
      username: "@emily",
      section: "B",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0194",
      name: "Mary Wollstonecraft Shelley",
      username: "@mary",
      section: "B",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0195",
      name: "Elizabeth Barrett Browning",
      username: "@elizabeth",
      section: "B",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0196",
      name: "George Eliot",
      username: "@eliot",
      section: "A",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0197",
      name: "William Shakespeare",
      username: "@shakespeare",
      section: "A",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0198",
      name: "Samuel Taylor Coleridge",
      username: "@coleridge",
      section: "B",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0199",
      name: "Katherine Mansfield",
      username: "@katherine",
      section: "B",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
    {
      id: "right0200",
      name: "Mary Sidney",
      username: "@mary",
      section: "B",
      address: "New York, United States",
      phone: "+880 1234-567890",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B195",
    "#C5CAE9",
  ];

  const sections = ["All Sections", "A", "B", "C", "D"];
  const classes = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsSectionOpen(false);
      setIsClassOpen(false);
    };
    if (isSectionOpen || isClassOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isSectionOpen, isClassOpen]);

  // Filter students based on search and selections
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection =
      selectedSection === "All Sections" || student.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
              Class 6
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-75">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for students"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSectionOpen(!isSectionOpen);
                    setIsClassOpen(false);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {selectedSection}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isSectionOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-45">
                    {sections.map((section) => (
                      <button
                        key={section}
                        onClick={() => {
                          setSelectedSection(section);
                          setIsSectionOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          selectedSection === section
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsClassOpen(!isClassOpen);
                    setIsSectionOpen(false);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {selectedClass}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isClassOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-45 max-h-75 overflow-y-auto">
                    {classes.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => {
                          setSelectedClass(cls);
                          setIsClassOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          selectedClass === cls
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </button>
              <button className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 w-8">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Student's Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-1">
                    Student's ID
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-1">
                    Section
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  <div className="flex items-center gap-1">
                    Address
                    <div className="ml-1 w-4 h-4 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center">
                      ?
                    </div>
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Phone No.
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {student.id}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {student.section}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{student.address}</td>
                  <td className="py-4 px-6 text-gray-700">{student.phone}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors">
            <span>←</span> Previous
          </button>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-orange-500 text-white rounded-lg font-medium">
              1
            </button>
            <button className="w-10 h-10 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              2
            </button>
            <button className="w-10 h-10 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="w-10 h-10 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              8
            </button>
            <button className="w-10 h-10 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              9
            </button>
            <button className="w-10 h-10 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              10
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors">
            Next <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
