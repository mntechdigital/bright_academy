"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ChevronRight,
  Plus,
  Loader2,
  DoorOpenIcon,
  ChevronDown,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { createSubject } from "@/src/services/subjects";
import { getClasses } from "@/src/services/classes";

interface CreateSubjectFormValues {
  classId: string;
  subjectName: string;
}

interface ClassOption {
  _id: string;
  className: string;
}

const CreateSubjectForm = () => {
  const [isPending, startTransition] = useTransition();
  const [classes, setClasses] = useState<ClassOption[]>([]);

  const form = useForm<CreateSubjectFormValues>({
    defaultValues: {
      classId: "",
      subjectName: "",
    },
  });

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await getClasses([]);
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setClasses(res.data.data);
      }
    };
    fetchClasses();
  }, []);

  const onSubmit: SubmitHandler<CreateSubjectFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        classId: data.classId,
        subjectName: data.subjectName,
      };
      const res = await createSubject(payload);
      if (res.statusCode === 201) {
        showSuccessToast("Subject created successfully!");
        form.reset();
      } else {
        showErrorToast(res.message || "Failed to create subject.");
      }
    });
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="flex items-center gap-1 text-foreground font-medium">
          <DoorOpenIcon className="h-4 w-4" />
          Add Class
        </span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Create Subject</h1>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
        {/* Class Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Class
          </label>
          <Controller
            name="classId"
            control={form.control}
            rules={{ required: "Class is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative">
                <select
                  {...field}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Subject Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Subject Name<span className="text-red-500">*</span>
          </label>
          <Controller
            name="subjectName"
            control={form.control}
            rules={{ required: "Subject name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Romantic Poetry"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-[#F97316] py-3 font-semibold text-white transition-all hover:bg-[#EA580C] h-12 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Subject
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateSubjectForm;
