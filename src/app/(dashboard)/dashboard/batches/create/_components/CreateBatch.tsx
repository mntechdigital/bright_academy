"use client";

import React, { useTransition } from "react";
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
import { createBatch } from "@/src/services/batches";

interface CreateBatchFormValues {
  name: string;
  classId: string;
  startTime: string;
  endTime: string;
}

interface ClassData {
  id: string;
  className: string;
}

interface CreateBatchProps {
  classesData?: ClassData[];
}

const CreateBatch = ({ classesData = [] }: CreateBatchProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateBatchFormValues>({
    defaultValues: {
      name: "",
      classId: "",
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit: SubmitHandler<CreateBatchFormValues> = async (data) => {
    startTransition(async () => {
      // Ensure both times are provided before submitting
      if (!data.startTime || !data.endTime) {
        showErrorToast("Both start time and end time are required.");
        return;
      }

      const payload = {
        name: data.name,
        classId: data.classId,
        startTime: data.startTime,
        endTime: data.endTime,
      };
      const res = await createBatch(payload);
      if (res.statusCode === 201) {
        showSuccessToast("Batch created successfully!");
        form.reset();
      } else {
        showErrorToast(res.message || "Failed to create batch.");
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
          href="/dashboard/batches"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Batches</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="flex items-center gap-1 text-foreground font-medium">
          <DoorOpenIcon className="h-4 w-4" />
          Add Batch
        </span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Create Batch</h1>

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
        {/* Batch Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Batch Name<span className="text-red-500">*</span>
          </label>
          <Controller
            name="name"
            control={form.control}
            rules={{ required: "Batch name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Batch A"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

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

        {/* Start Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Start Time<span className="text-red-500">*</span>
          </label>
          <Controller
            name="startTime"
            control={form.control}
            rules={{ required: "Start time is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="time"
                  step="60"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* End Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            End Time<span className="text-red-500">*</span>
          </label>
          <Controller
            name="endTime"
            control={form.control}
            rules={{
              required: "End time is required",
              validate: (value) => {
                const startTime = form.getValues("startTime");
                if (startTime && value && value <= startTime) {
                  return "End time must be after start time";
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="time"
                  step="60"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
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
              Create Batch
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateBatch;
