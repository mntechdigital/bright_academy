"use client";

import React, { useEffect, useTransition } from "react";
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
import { getSubjectById, updateSubject } from "@/src/services/subjects";
import { getClasses } from "@/src/services/classes";

interface EditSubjectFormValues {
  subjectName: string;
  classId: string;
}

interface ClassData {
  id: string;
  className: string;
}

const EditSubjectForm = ({ subjectId }: { subjectId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [classesData, setClassesData] = React.useState<ClassData[]>([]);

  const form = useForm<EditSubjectFormValues>({
    defaultValues: {
      subjectName: "",
      classId: "",
    },
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classQuery = [
          {
            key: "orderBy",
            value: JSON.stringify({ createdAt: "asc" }),
          },
        ];
        const res = await getClasses(classQuery);
        if (res?.data?.data) {
          setClassesData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await getSubjectById(subjectId);
        if (res?.data) {
          form.reset({
            subjectName: res.data.subjectName || "",
            classId: res.data.classId || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch subject:", error);
      }
    };
    fetchSubject();
  }, [subjectId, form]);

  const onSubmit: SubmitHandler<EditSubjectFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        subjectName: data.subjectName,
        classId: data.classId,
      };

      const res = await updateSubject(subjectId, payload);
      if (res.statusCode === 200) {
        showSuccessToast(res.message || "Subject updated successfully!");
        form.reset();
        router.push("/dashboard/subjects");
      } else {
        showErrorToast(res.message || "Failed to update subject.");
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
          href="/dashboard/subjects"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <DoorOpenIcon className="h-4 w-4" />
          <span>Subjects</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Edit Subject</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Subject</h1>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            (e.target as HTMLElement).tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
          }
        }}
        className="max-w-full"
      >
        {/* Class Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Class<span className="text-red-500">*</span>
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
                  {classesData.map((cls) => (
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
                Update Subject
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

export default EditSubjectForm;