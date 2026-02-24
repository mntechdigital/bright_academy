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
import { createSections } from "@/src/services/sections";
import { getClasses } from "@/src/services/classes";

interface CreateSectionFormValues {
  classId: string;
  sectionName: string;
}

interface ClassOption {
  id: string;
  className: string;
}

const CreateSectionForm = () => {
  const [isPending, startTransition] = useTransition();
  const [classes, setClasses] = useState<ClassOption[]>([]);

  const form = useForm<CreateSectionFormValues>({
    defaultValues: {
      classId: "",
      sectionName: "",
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

  const onSubmit: SubmitHandler<CreateSectionFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        classId: data.classId,
        sectionName: data.sectionName,
      };
      const res = await createSections(payload);
      if (res.statusCode === 201) {
        showSuccessToast("Section created successfully!");
        form.reset();
      } else {
        showErrorToast(res.message || "Failed to create section.");
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
          Add Section
        </span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Create Section</h1>

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
                    <option key={cls.id} value={cls.id}>
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

        {/* Section Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Section Name<span className="text-red-500">*</span>
          </label>
          <Controller
            name="sectionName"
            control={form.control}
            rules={{ required: "Section name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="A"
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
              Create Section
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateSectionForm;
