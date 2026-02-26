import React from 'react'


import { FaEye, FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';

const students = [
  {
    name: 'Percy Bysshe Shelley',
    username: '@shelley',
    id: 'right0191',
    section: 'A',
    totalMark: 600,
    achievedMark: 550,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Lord Byron',
    username: '@byron',
    id: 'right0192',
    section: 'A',
    totalMark: 600,
    achievedMark: 550,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    name: 'Emily Elizabeth Dickinson',
    username: '@emily',
    id: 'right0193',
    section: 'B',
    totalMark: 600,
    achievedMark: 550,
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    name: 'Mary Wollstonecraft Shelley',
    username: '@mary',
    id: 'right0194',
    section: 'B',
    totalMark: 600,
    achievedMark: 550,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    name: 'Elizabeth Barrett Browning',
    username: '@elizabeth',
    id: 'right0195',
    section: 'B',
    totalMark: 600,
    achievedMark: 550,
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
];

const ShowMonthlyResultTable = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search for students"
            className="border rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring"
          />
          <select className="border rounded px-3 py-2 w-full md:w-40">
            <option>Select Class</option>
            <option>Class 6</option>
          </select>
          <select className="border rounded px-3 py-2 w-full md:w-40">
            <option>Select Section</option>
            <option>A</option>
            <option>B</option>
          </select>
          <select className="border rounded px-3 py-2 w-full md:w-40">
            <option>Select Exam</option>
            <option>Monthly</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button className="flex items-center gap-2 border px-4 py-2 rounded bg-white hover:bg-gray-100 text-gray-700">
            <FaFileAlt /> Download CSV
          </button>
          <button className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            Give Result
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-2 text-left">Student's Name</th>
              <th className="px-4 py-2 text-left">Student's ID</th>
              <th className="px-4 py-2 text-left">Section</th>
              <th className="px-4 py-2 text-left">Total Mark</th>
              <th className="px-4 py-2 text-left">Achieved Mark</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2 flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-gray-500 text-sm">{student.username}</div>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    {student.id}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    {student.section}
                  </span>
                </td>
                <td className="px-4 py-2">{student.totalMark}</td>
                <td className="px-4 py-2">{student.achievedMark}</td>
                <td className="px-4 py-2 flex gap-3 text-lg">
                  <button className="text-gray-600 hover:text-gray-900" title="View">
                    <FaEye />
                  </button>
                  <button className="text-green-600 hover:text-green-800" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="text-orange-500 hover:text-orange-700" title="Delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShowMonthlyResultTable
