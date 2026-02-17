"use client";

import React, { useState } from "react";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface ClassData {
  id: string;
  className: string;
  sections?: { id: string; sectionName: string }[];
  subjects?: { id: string; subjectName: string }[];
}

interface WeeklyResultFormProps {
  classesData?: ClassData[];
}

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

const WeeklyResultForm = ({ classesData = [] }: WeeklyResultFormProps) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [publishedDate, setPublishedDate] = useState<Date | undefined>(new Date());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const sections = selectedClass?.sections || [];
  const subjects = selectedClass?.subjects || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Month</label>
          <div className="relative">
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
              <option value="">Select Month</option>
              {months.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Week</label>
          <div className="relative">
            <select value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
              <option value="">Select Week</option>
              {weeks.map(week => <option key={week} value={week}>{week}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Published Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 h-auto text-sm text-gray-700 font-normal hover:bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
                {publishedDate ? format(publishedDate, "MMMM d, yyyy") : <span className="text-gray-400">Select Date</span>}
                <CalendarIcon className="h-4 w-4 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={publishedDate} onSelect={setPublishedDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Year</label>
          <div className="relative">
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
              {years.map(year => <option key={year} value={year.toString()}>{year}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Class</label>
          <div className="relative">
            <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
              <option value="">Select Class</option>
              {classesData.map(cls => <option key={cls.id} value={cls.id}>{cls.className}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Section</label>
          <div className="relative">
            <select value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)} disabled={!selectedClassId} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed">
              <option value="">Select Section</option>
              {sections.map(section => <option key={section.id} value={section.id}>{section.sectionName}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Select Subject</label>
        <div className="relative">
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            disabled={!selectedClassId}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Total Marks</label>
      <input
        value={subjectName}
        onChange={e => setSubjectName(e.target.value)}
        type="number"
        placeholder="Enter total marks"
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
        min={0}
      />
    </div>
    </div>
  );
};

export default WeeklyResultForm;
