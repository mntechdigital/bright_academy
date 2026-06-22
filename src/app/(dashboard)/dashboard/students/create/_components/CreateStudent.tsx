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

interface CreateStudentFormValues {
  studentName: string;
  stdRegNo: string;
  password: string;
  classId: string;
  batchId: string;
  parentPhone: string;
  address: string;
  gender: string;
}

interface ClassData {
  id: string;
  className: string;
}

interface BatchData {
  id: string;
  name: string;
  classId: string;
  startTime: string;
  endTime: string;
}

interface CreateStudentProps {
  classesData?: ClassData[];
  batchesData?: BatchData[];
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const CreateStudent = ({ classesData = [], batchesData = [] }: CreateStudentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateStudentFormValues>({
    defaultValues: {
      studentName: "",
      stdRegNo: "",
      password: "",
      classId: "",
      batchId: "",
      parentPhone: "",
      address: "",
      gender: "",
    },
  });

  // Get batches for selected class only
  const filteredBatches = batchesData.filter((batch) => batch.classId === selectedClassId);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedBatchId("");
    form.setValue("classId", classId);
    form.setValue("batchId", "");
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    form.setValue("batchId", batchId);
  };

  const onSubmit: SubmitHandler<CreateStudentFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        name: data.studentName,
        stdRegNo: data.stdRegNo,
        password: data.password,
        classId: data.classId,
        batchId: data.batchId,
        parentPhone: data.parentPhone,
        address: data.address,
        gender: data.gender,
      };

      const res = await createStudent(payload);
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

        {/* Student Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Student's Name<span className="text-red-500">*</span>
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
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Registration No. */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Registration No.<span className="text-red-500">*</span>
          </label>
          <Controller
            name="stdRegNo"
            control={form.control}
            rules={{ required: "Registration number is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="REG-2024-001"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Password<span className="text-red-500">*</span>
          </label>
          <Controller
            name="password"
            control={form.control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Class */}
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
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Batch */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Batch<span className="text-red-500">*</span>
          </label>
          <Controller
            name="batchId"
            control={form.control}
            rules={{ required: "Batch is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative">
                <select
                  {...field}
                  disabled={!selectedClassId}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Batch</option>
                  {filteredBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name} ({formatTime(batch.startTime)} - {formatTime(batch.endTime)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Parent Phone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Parent's Phone No.<span className="text-red-500">*</span>
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
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Address */}
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
                  placeholder="Barisal, Bangladesh"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Gender */}
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
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
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