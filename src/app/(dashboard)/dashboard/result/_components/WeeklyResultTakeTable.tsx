
import React from "react";
import { Student } from "./studentTableTypes";

const WeeklyResultTakeTable = ({ studentsData,totalMark }: { studentsData: Student[], totalMark: number }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 my-10">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mr-3">Students</h2>
        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">Class 6</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="px-4 py-3 font-medium text-left">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 font-medium text-left">Student's Name</th>
              <th className="px-4 py-3 font-medium text-left">Student's ID</th>
              <th className="px-4 py-3 font-medium text-left">Total Marks <span className="ml-1 cursor-pointer" title="Total marks">&#9432;</span></th>
              <th className="px-4 py-3 font-medium text-left">Obtain Marks <span className="ml-1 cursor-pointer" title="Obtain marks">&#9432;</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studentsData.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.username}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                    {student.studentId}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 text-sm font-medium">{totalMark}</td>
                <td className="px-4 py-3 text-gray-900 text-sm font-medium">
                    <input type="text" defaultValue={student.obtainMark} className="w-20 border border-gray-300 rounded px-2 py-1" />
                    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyResultTakeTable;
