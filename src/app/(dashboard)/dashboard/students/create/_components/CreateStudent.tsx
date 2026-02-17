"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ChevronRight,
  ArrowRight,
  Loader2,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { createStudent } from "@/src/services/students";
import { Pattaya } from "next/font/google";

interface CreateStudentFormValues {
  studentName: string;
  classId: string;
  sectionId: string;
  parentPhone: string;
  address: string;
  gender: string;
}

interface ClassData {
  id: string;
  className: string;
  sections?: {
    id: string;
    sectionName: string;
  }[];
}

interface CreateStudentProps {
  classesData?: ClassData[];
}

const CreateStudent = ({ classesData = [] }: CreateStudentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const form = useForm<CreateStudentFormValues>({
    defaultValues: {
      studentName: "",
      classId: "",
      sectionId: "",
      parentPhone: "",
      address: "",
      gender: "",
    },
  });

  // Get sections for selected class
  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const sections = selectedClass?.sections || [];

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    form.setValue("sectionId", ""); // Reset section when class changes
  };

  const onSubmit: SubmitHandler<CreateStudentFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        name: data.studentName,
        classId: data.classId,
        sectionId: data.sectionId,
        parentPhone: data.parentPhone,
        address: data.address,
        gender: data.gender,
      };

      console.log("see student info==>", payload)

      const res = await createStudent(payload);
      console.log("registration std response==>",res)
      if (res.statusCode === 201) {
        showSuccessToast("Student created successfully!");
        form.reset();
        router.push("/dashboard/students");
      } else {
        showErrorToast(res.message || "Failed to create student.");
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
          <UserPlus className="h-4 w-4" />
          Add Student
        </span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Add Student</h1>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
        {/* Student Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Student&apos;s Name<span className="text-red-500">*</span>
          </label>
          <Controller
            name="studentName"
            control={form.control}
            rules={{ required: "Student name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="William Shakespeare"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Class Select */}
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
                  onChange={(e) => handleClassChange(e.target.value)}
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

        {/* Section Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Section<span className="text-red-500">*</span>
          </label>
          <Controller
            name="sectionId"
            control={form.control}
            rules={{ required: "Section is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative">
                <select
                  {...field}
                  disabled={!selectedClassId}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.sectionName}
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

        {/* Parent Phone Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Parent&apos;s Phone No.<span className="text-red-500">*</span>
          </label>
          <Controller
            name="parentPhone"
            control={form.control}
            rules={{ required: "Parent phone number is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="+880 1234-567890"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Address Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Address<span className="text-red-500">*</span>
          </label>
          <Controller
            name="address"
            control={form.control}
            rules={{ required: "Address is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="New York, United States"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Gender Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Gender<span className="text-red-500">*</span>
          </label>
          <Controller
            name="gender"
            control={form.control}
            rules={{ required: "Gender is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative">
                <select
                  {...field}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateStudent;
