"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import MonthlyResultTable from "./MonthlyResultTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Batch  { id: string; name: string; startTime: string; endTime: string }
interface Subject  { id: string; subjectName: string }
interface Student  { id: string; name?: string; studentName?: string; fullName?: string; sectionId?: string }

interface ClassData {
  id: string;
  className: string;
  batches?: Batch[];
  subjects?: Subject[];
  students?: Student[];
}

interface FormValues {
  month: string;
  year: string;
  publishedDate: Date;
  classId: string;
  batchId: string;
  studentId: string;
}

interface MonthlyResultFormProps {
  classesData?: ClassData[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

// ─── Shared select style ──────────────────────────────────────────────────────

const selectClass =
  "w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-orange-400 focus:ring-1 focus:ring-orange-400 disabled:bg-gray-100 disabled:cursor-not-allowed";

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Select with chevron ──────────────────────────────────────────────────────

function SelectField({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={selectClass} {...props}>
        {children}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MonthlyResultForm({ classesData = [] }: MonthlyResultFormProps) {
  const [tableData, setTableData] = useState<{ studentName: string; subjects: Subject[]; studentId: string } | null>(null);

  const { control, watch, setValue, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: currentYear.toString(),
      publishedDate: new Date(),
      classId: "",
      batchId: "",
      studentId: "",
    },
  });

  const selectedClassId  = watch("classId");
  const selectedBatchId = watch("batchId");

  const selectedClass = classesData.find((c) => c.id === selectedClassId);
  const batches = selectedClass?.batches ?? [];

  const students = (selectedClass?.students ?? [])
    .filter((s) => !s.sectionId || s.sectionId === selectedBatchId)
    .map((s) => ({ id: s.id, name: s.name ?? s.studentName ?? s.fullName ?? "Unnamed" }));

  const onSubmit = (data: FormValues) => {
    const student = students.find((s) => s.id === data.studentId);
    setTableData({
      studentName: student?.name ?? "Unnamed",
      subjects: selectedClass?.subjects ?? [],
      studentId: data.studentId,
    });
    // Reset form after submit
    handleSubmit((formData) => {
      // Form submission logic here
    })();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Row 1 — Month & Published Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Month" error={errors.month?.message}>
            <Controller name="month" control={control} rules={{ required: "Month is required" }}
              render={({ field }) => (
                <SelectField {...field}>
                  <option value="">Select Month</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </SelectField>
              )}
            />
          </Field>

          <Field label="Published Date" error={errors.publishedDate?.message}>
            <Popover>
              <PopoverTrigger asChild>
                <Controller name="publishedDate" control={control} rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <Button variant="outline" className="w-full justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 h-auto text-sm text-gray-700 font-normal hover:bg-white">
                      {field.value ? format(field.value, "MMMM d, yyyy") : <span className="text-gray-400">Select Date</span>}
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </Button>
                  )}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Controller name="publishedDate" control={control}
                  render={({ field }) => (
                    <Calendar mode="single" selected={field.value} onSelect={(d) => d && setValue("publishedDate", d)} initialFocus />
                  )}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {/* Row 2 — Year & Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Year" error={errors.year?.message}>
            <Controller name="year" control={control} rules={{ required: "Year is required" }}
              render={({ field }) => (
                <SelectField {...field}>
                  {YEARS.map((y) => <option key={y} value={y.toString()}>{y}</option>)}
                </SelectField>
              )}
            />
          </Field>

          <Field label="Class" error={errors.classId?.message}>
            <Controller name="classId" control={control} rules={{ required: "Class is required" }}
              render={({ field }) => (
                <SelectField {...field}>
                  <option value="">Select Class</option>
                  {classesData.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
                </SelectField>
              )}
            />
          </Field>
        </div>

        {/* Row 3 — Batch & Student */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Batch" error={errors.batchId?.message}>
            <Controller name="batchId" control={control} rules={{ required: "Batch is required" }}
              render={({ field }) => (
                <SelectField {...field} disabled={!selectedClassId}>
                  <option value="">Select Batch</option>
                  {batches.map((b) => <option key={b.id} value={b.id}>{b.name} ({formatTime(b.startTime)} - {formatTime(b.endTime)})</option>)}
                </SelectField>
              )}
            />
          </Field>

          <Field label="Student's Name" error={errors.studentId?.message}>
            <Controller name="studentId" control={control} rules={{ required: "Student is required" }}
              render={({ field }) => (
                <SelectField {...field} disabled={!selectedBatchId || students.length === 0}>
                  <option value="">Select Student</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </SelectField>
              )}
            />
          </Field>
        </div>

        <Button type="submit" className="w-full">Submit</Button>
      </form>

      {/* Result table — shown after submit */}
      {tableData && (
        <div className="mt-10">
          <MonthlyResultTable
            studentName={tableData.studentName}
            subjects={tableData.subjects}
            studentId={tableData.studentId}
            month={watch("month")}
          />
        </div>
      )}
    </div>
  );
}