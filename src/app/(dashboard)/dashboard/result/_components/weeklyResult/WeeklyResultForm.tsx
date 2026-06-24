"use client";

import React, { useState } from "react";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { createWeeklyResult } from "@/src/services/weeklyResult";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { useForm, Controller } from "react-hook-form";
import { months, weeks } from "@/src/constant/weeklyResult.constant";

interface ClassData {
  id: string;
  className: string;
  batches?: { id: string; name: string; startTime: string; endTime: string }[];
  subjects?: { id: string; subjectName: string }[];
}

interface WeeklyResultFormProps {
  classesData?: ClassData[];
  onResultCreated?: () => void;
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

const WeeklyResultForm = ({ classesData = [], onResultCreated }: WeeklyResultFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      month: "",
      week: "",
      publishedDate: new Date(),
      year: new Date().getFullYear().toString(),
      classId: "",
      batchId: "",
      subjectId: "",
      totalMarks: 0,
    },
    mode: "onSubmit",
  });

  const selectedClassId = watch("classId");
  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const batches = selectedClass?.batches || [];
  const subjects = selectedClass?.subjects || [];

  const onSubmit = async (data: any) => {
    const res = await createWeeklyResult({
      ...data,
      totalMarks: parseInt(data.totalMarks, 10),
      publishedDate: data.publishedDate
        ? data.publishedDate.toISOString()
        : undefined,
    });
    if (res.statusCode === 201) {
      showSuccessToast("Weekly result created successfully!");
      reset();
      onResultCreated?.();
    } else {
      showErrorToast(res.message || "Failed to create weekly result");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Month
          </label>
          <div className="relative">
            <Controller
              name="month"
              control={control}
              rules={{ required: "Month is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  >
                    <option value="">Select Month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {errors.month && (
                    <span className="text-red-500 text-xs">{errors.month.message}</span>
                  )}
                </>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Week
          </label>
          <div className="relative">
            <Controller
              name="week"
              control={control}
              rules={{ required: "Week is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  >
                    <option value="">Select Week</option>
                    {weeks.map((week) => (
                      <option key={week} value={week}>
                        {week}
                      </option>
                    ))}
                  </select>
                  {errors.week && (
                    <span className="text-red-500 text-xs">{errors.week.message}</span>
                  )}
                </>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Published Date
          </label>
          <Controller
            name="publishedDate"
            control={control}
            rules={{ required: "Published date is required" }}
            render={({ field }) => (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 h-auto text-sm text-gray-700 font-normal hover:bg-white focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                    >
                      {field.value ? (
                        format(field.value, "MMMM d, yyyy")
                      ) : (
                        <span className="text-gray-400">Select Date</span>
                      )}
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.publishedDate && (
                  <span className="text-red-500 text-xs">{errors.publishedDate.message}</span>
                )}
              </>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Year
          </label>
          <div className="relative">
            <Controller
              name="year"
              control={control}
              rules={{ required: "Year is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <span className="text-red-500 text-xs">{errors.year.message}</span>
                  )}
                </>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Class
          </label>
          <div className="relative">
            <Controller
              name="classId"
              control={control}
              rules={{ required: "Class is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  >
                    <option value="">Select Class</option>
                    {classesData.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                  {errors.classId && (
                    <span className="text-red-500 text-xs">{errors.classId.message}</span>
                  )}
                </>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Batch
          </label>
          <div className="relative">
            <Controller
              name="batchId"
              control={control}
              rules={{ required: "Batch is required" }}
              render={({ field }) => (
                <>
                  <select
                    {...field}
                    disabled={!selectedClassId}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name} ({formatTime(batch.startTime)} - {formatTime(batch.endTime)})
                      </option>
                    ))}
                  </select>
                  {errors.batchId && (
                    <span className="text-red-500 text-xs">{errors.batchId.message}</span>
                  )}
                </>
              )}
            />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Subject
        </label>
        <div className="relative">
          <Controller
            name="subjectId"
            control={control}
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <>
                <select
                  {...field}
                  disabled={!selectedClassId}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
                {errors.subjectId && (
                  <span className="text-red-500 text-xs">{errors.subjectId.message}</span>
                )}
              </>
            )}
          />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Total Marks
        </label>
        <Controller
          name="totalMarks"
          control={control}
          rules={{
            required: "Total marks is required",
            min: { value: 0, message: "Total marks must be at least 0" },
            validate: (value) => Number.isInteger(value) || "Total marks must be an integer",
          }}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              placeholder="Enter total marks"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              min={0}
              step={1}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
            />
          )}
        />
        {errors.totalMarks && (
          <span className="text-red-500 text-xs">{errors.totalMarks.message}</span>
        )}
      </div>
      <div>
        <button
          type="submit"
          className=" w-full bg-[#F97316] text-white py-3 rounded-lg hover:bg-[#ea580c] transition-all disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Weekly Result"}
        </button>
      </div>
    </form>
  );
};

export default WeeklyResultForm;
