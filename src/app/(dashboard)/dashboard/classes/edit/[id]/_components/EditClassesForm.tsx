"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ChevronRight,
  Save,
  Loader2,
  DoorOpenIcon,
  X,
  ChevronDown,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getClassById, updateClass } from "@/src/services/classes";
import { getSections } from "@/src/services/sections";
import { getSubjects } from "@/src/services/subjects";

interface EditClassFormValues {
  className: string;
  sectionIds: string[];
  subjectIds: string[];
}

interface SectionOption {
  id: string;
  sectionName: string;
}

interface SubjectOption {
  id: string;
  subjectName: string;
}

const EditClassesForm = ({ classId }: { classId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const form = useForm<EditClassFormValues>({
    defaultValues: {
      className: "",
      sectionIds: [],
      subjectIds: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch class data
      const classRes = await getClassById(classId);
      if (classRes?.data) {
        form.reset({
          className: classRes.data.className || "",
          sectionIds: classRes.data.sectionIds || [],
          subjectIds: classRes.data.subjectIds || [],
        });
      }

      // Fetch sections
      const sectionsRes = await getSections([]);
      if (sectionsRes?.data?.data && Array.isArray(sectionsRes.data.data)) {
        setSections(sectionsRes.data.data);
      }

      // Fetch subjects
      const subjectsRes = await getSubjects([]);
      if (subjectsRes?.data?.data && Array.isArray(subjectsRes.data.data)) {
        setSubjects(subjectsRes.data.data);
      }
    };
    fetchData();
  }, [classId, form]);

  const onSubmit: SubmitHandler<EditClassFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        className: data.className,
        sectionIds: data.sectionIds,
        subjectIds: data.subjectIds,
      };
      console.log("Update class payload:", payload);

      const res = await updateClass(classId, payload);
      if (res.statusCode === 200) {
        showSuccessToast(res.message || "Class updated successfully!");
        form.reset();
        router.push("/dashboard/classes");
      } else {
        showErrorToast(res.message || "Failed to update class.");
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
        <Link
          href="/dashboard/classes"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <DoorOpenIcon className="h-4 w-4" />
          <span>Classes</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Edit Class</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Class</h1>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
        {/* Class Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Class Name<span className="text-red-500">*</span>
          </label>
          <Controller
            name="className"
            control={form.control}
            rules={{ required: "Class name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Class 6"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Sections Multi-Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Sections
          </label>
          <Controller
            name="sectionIds"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="border border-gray-200 rounded-lg bg-white p-4">
                  {sections.length > 0 ? (
                    <div className="space-y-3">
                      {sections.map((section) => (
                        <div key={section.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`section-${section.id}`}
                            checked={field.value?.includes(section.id) || false}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), section.id]
                                : (field.value || []).filter((id) => id !== section.id);
                              field.onChange(newValue);
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#F97316] cursor-pointer"
                          />
                          <label
                            htmlFor={`section-${section.id}`}
                            className="ml-3 text-sm text-gray-700 cursor-pointer"
                          >
                            {section.sectionName}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No sections available</p>
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Subjects Multi-Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Subjects
          </label>
          <Controller
            name="subjectIds"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="border border-gray-200 rounded-lg bg-white p-4">
                  {subjects.length > 0 ? (
                    <div className="space-y-3">
                      {subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`subject-${subject.id}`}
                            checked={field.value?.includes(subject.id) || false}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), subject.id]
                                : (field.value || []).filter((id) => id !== subject.id);
                              field.onChange(newValue);
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#F97316] cursor-pointer"
                          />
                          <label
                            htmlFor={`subject-${subject.id}`}
                            className="ml-3 text-sm text-gray-700 cursor-pointer"
                          >
                            {subject.subjectName}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No subjects available</p>
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-[#F97316] py-3 font-semibold text-white transition-all hover:bg-[#EA580C] h-12 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Class
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg bg-red-500 py-3 font-semibold text-white transition-all hover:bg-red-600 h-12 px-6 cursor-pointer"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditClassesForm;
