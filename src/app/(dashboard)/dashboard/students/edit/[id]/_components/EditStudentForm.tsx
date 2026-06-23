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
  UserPlus,
  X,
  ChevronDown,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getStudentById, updateStudent } from "@/src/services/students";

interface EditStudentFormValues {
  name: string;
  classId: string;
  batchId: string;
  parentPhone: string;
  address: string;
  gender: string;
}

interface ClassData {
  id: string;
  className: string;
  batches?: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  }[];
}

interface EditStudentFormProps {
  studentId: string;
  classesData?: ClassData[];
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const EditStudentForm = ({ studentId, classesData = [] }: EditStudentFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const form = useForm<EditStudentFormValues>({
    defaultValues: {
      name: "",
      classId: "",
      batchId: "",
      parentPhone: "",
      address: "",
      gender: "",
    },
  });

  // Get batches for selected class
  const selectedClass = classesData.find((cls) => cls.id === selectedClassId);
  const batches = selectedClass?.batches || [];

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await getStudentById(studentId);
      if (res?.data) {
        const student = res.data;
        setSelectedClassId(student.classId || "");
        form.reset({
          name: student.name || "",
          classId: student.classId || "",
          batchId: student.batchId || "",
          parentPhone: student.parentPhone || "",
          address: student.address || "",
          gender: student.gender || "",
        });
      }
    };
    fetchStudent();
  }, [studentId, form]);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    form.setValue("classId", classId);
    form.setValue("batchId", ""); // Reset batch when class changes
  };

  const onSubmit: SubmitHandler<EditStudentFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        name: data.name,
        classId: data.classId,
        batchId: data.batchId || undefined,
        parentPhone: data.parentPhone,
        address: data.address,
        gender: data.gender || undefined,
      };

      const res = await updateStudent(studentId, payload);
      if (res.statusCode === 200) {
        showSuccessToast(res.message || "Student updated successfully!");
        form.reset();
        router.push("/dashboard/students");
      } else {
        showErrorToast(res.message || "Failed to update student.");
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
          href="/dashboard/students"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Students</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Edit Student</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Student</h1>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
        {/* Student Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Student&apos;s Name<span className="text-red-500">*</span>
          </label>
          <Controller
            name="name"
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
            Class
          </label>
          <Controller
            name="classId"
            control={form.control}
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

        {/* Batch Select */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Batch
          </label>
          <Controller
            name="batchId"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <div className="relative">
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
            Gender
          </label>
          <Controller
            name="gender"
            control={form.control}
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
                Update Student
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

export default EditStudentForm;
