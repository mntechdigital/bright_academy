"use client";
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Edit } from 'lucide-react';

export default function TeacherManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const teachers = [
    { id: 'right0191', name: 'Percy Bysshe Shelley', username: '@shelley', avatar: '👤' },
    { id: 'right0192', name: 'Lord Byron', username: '@byron', avatar: '👤' },
    { id: 'right0193', name: 'Emily Elizabeth Dickinson', username: '@emily', avatar: '👤' },
    { id: 'right0194', name: 'Mary Wollstonecraft Shelley', username: '@mary', avatar: '👤' },
    { id: 'right0195', name: 'Elizabeth Barrett Browning', username: '@elizabeth', avatar: '👤' },
    { id: 'right0196', name: 'George Eliot', username: '@eliot', avatar: '👤' },
    { id: 'right0197', name: 'William Shakespeare', username: '@shakespeare', avatar: '👤' },
    { id: 'right0198', name: 'Samuel Taylor Coleridge', username: '@coleridge', avatar: '👤' },
    { id: 'right0199', name: 'Katherine Mansfield', username: '@katherine', avatar: '👤' },
    { id: 'right0200', name: 'Mary Sidney', username: '@mary', avatar: '👤' },
  ];

  const totalPages = 10;

  const renderPageNumbers = () => {
    const pages = [];
    
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1"
        >
          <ChevronLeft size={18} />
          Previous
        </button>
      );
    }

    // Page numbers
    const pageNumbers = [1, 2, 3, '...', 8, 9, 10];
    pageNumbers.forEach((page, idx) => {
      if (page === '...') {
        pages.push(
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      } else {
        pages.push(
          <button
            key={page}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-orange-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        );
      }
    });

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1"
        >
          Next
          <ChevronRight size={18} />
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="my-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Teacher</h1>
            <span className="text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-full">Bright Academy</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for teachers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-gray-200">
                <th className="px-8 py-4 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-gray-600">
                  Teacher's Name
                </th>
                <th className="px-4 py-4 text-right">
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Teacher's ID
                    <ChevronDown size={16} />
                  </button>
                </th>
                <th className="px-8 py-4 text-right text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === teachers.length - 1 ? 'border-0' : ''
                  }`}
                >
                  <td className="px-8 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                        {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {teacher.id}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-purple-600 hover:text-purple-700 transition-colors">
                      <Edit size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderPageNumbers()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}