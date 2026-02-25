"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import MonthlyResultTable from "./MonthlyResultTable";

interface ClassData {
  id: string;
  className: string;
  sections?: { id: string; sectionName: string }[];
  subjects?: { id: string; subjectName: string }[];
  students?: { id: string; name?: string; studentName?: string; fullName?: string; sectionId?: string }[];
}

interface MonthlyResultFormProps {
  classesData?: ClassData[];
}

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

const MonthlyResultForm = ({ classesData = [] }: MonthlyResultFormProps) => {
  const { control, watch, setValue, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      month: "",
      publishedDate: new Date(),
      year: currentYear.toString(),
      classId: "",
      sectionId: "",
      subjectId: "",
      studentName: "",
    },
  });
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState<{ studentName: string; subjects: any[] } | null>(null);

  const onSubmit = (data: any) => {
    // handle form submit
    console.log("Form submitted:", data);
    const selectedClass = classesData.find((cls) => cls.id === data.classId);
    const selectedStudent = (selectedClass?.students || []).find(
      (stu: any) => stu.id === data.studentName
    );
    const studentName = selectedStudent?.name || selectedStudent?.studentName || selectedStudent?.fullName || "Unnamed";
    const subjects = selectedClass?.subjects || [];
    setTableData({ studentName, subjects });
    setShowTable(true);
  };

  console.log("see monthyResult data==>",classesData);
  const selectedMonth = watch("month");
  const publishedDate = watch("publishedDate");
  const selectedYear = watch("year");
  const selectedClassId = watch("classId");
  const selectedSectionId = watch("sectionId");
  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const sections = selectedClass?.sections || [];
  // Get students for the selected class and section
  let students: { id: string; name: string; sectionId?: string }[] = [];
  if (selectedClass && selectedSectionId) {
    // If students have sectionId, filter by sectionId, else show all
    if (Array.isArray(selectedClass.students)) {
      students = selectedClass.students.filter(
        (stu: any) => !stu.sectionId || stu.sectionId === selectedSectionId
      ).map((stu: any) => ({ id: stu.id, name: stu.name || stu.studentName || stu.fullName || "Unnamed", sectionId: stu.sectionId }));
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Month</label>
            <div className="relative">
              <Controller
                name="month"
                control={control}
                rules={{ required: "Month is required" }}
                render={({ field }) => (
                  <select {...field} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
                    <option value="">Select Month</option>
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                )}
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Published Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Controller
                  name="publishedDate"
                  control={control}
                  rules={{ required: "Published date is required" }}
                  render={({ field }) => (
                    <Button variant="outline" className="w-full justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 h-auto text-sm text-gray-700 font-normal hover:bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
                      {field.value ? format(field.value, "MMMM d, yyyy") : <span className="text-gray-400">Select Date</span>}
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </Button>
                  )}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Controller
                  name="publishedDate"
                  control={control}
                  rules={{ required: "Published date is required" }}
                  render={({ field }) => (
                    <Calendar mode="single" selected={field.value} onSelect={date => { if (date) setValue("publishedDate", date); }} initialFocus />
                  )}
                />
              </PopoverContent>
            </Popover>
            {errors.publishedDate && <p className="text-red-500 text-xs mt-1">{errors.publishedDate.message}</p>}
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Year</label>
          <div className="relative">
            <Controller
              name="year"
              control={control}
              rules={{ required: "Year is required" }}
              render={({ field }) => (
                <select {...field} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
                  {years.map(year => <option key={year} value={year.toString()}>{year}</option>)}
                </select>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Class</label>
          <div className="relative">
            <Controller
              name="classId"
              control={control}
              rules={{ required: "Class is required" }}
              render={({ field }) => (
                <select {...field} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]">
                  <option value="">Select Class</option>
                  {classesData.map(cls => <option key={cls.id} value={cls.id}>{cls.className}</option>)}
                </select>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.classId && <p className="text-red-500 text-xs mt-1">{errors.classId.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Section</label>
          <div className="relative">
            <Controller
              name="sectionId"
              control={control}
              rules={{ required: "Section is required" }}
              render={({ field }) => (
                <select {...field} disabled={!selectedClassId} className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed">
                  <option value="">Select Section</option>
                  {sections.map(section => <option key={section.id} value={section.id}>{section.sectionName}</option>)}
                </select>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          {errors.sectionId && <p className="text-red-500 text-xs mt-1">{errors.sectionId.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Student's Name</label>
          <Controller
            name="studentName"
            control={control}
            rules={{ required: "Student is required" }}
            render={({ field }) => (
              <select {...field} disabled={!selectedClassId || !selectedSectionId || students.length === 0} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed">
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            )}
          />
          {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
        </div>
      </div>
        <div className="mt-6">
          <Button type="submit" className="w-full">Submit</Button>
        </div>
      </form>
      {showTable && tableData && (
        <div className="mt-10">
          <MonthlyResultTable studentName={tableData.studentName} subjects={tableData.subjects} />
        </div>
      )}
    </div>
  );
};

export default MonthlyResultForm;
