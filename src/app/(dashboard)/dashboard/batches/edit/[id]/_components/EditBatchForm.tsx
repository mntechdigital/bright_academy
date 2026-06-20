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
import { getBatchById, updateBatch } from "@/src/services/batches";
import { getClasses } from "@/src/services/classes";

interface EditBatchFormValues {
  name: string;
  classId: string;
  startTime: string;
  endTime: string;
}

interface ClassData {
  id: string;
  className: string;
}

const EditBatchForm = ({ batchId }: { batchId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [classesData, setClassesData] = React.useState<ClassData[]>([]);

  const form = useForm<EditBatchFormValues>({
    defaultValues: {
      name: "",
      classId: "",
      startTime: "",
      endTime: "",
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
    const fetchBatch = async () => {
      try {
        const res = await getBatchById(batchId);
        if (res?.data) {
          form.reset({
            name: res.data.name || "",
            classId: res.data.classId || "",
            startTime: res.data.startTime || "",
            endTime: res.data.endTime || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch batch:", error);
      }
    };
    fetchBatch();
  }, [batchId, form]);

  const onSubmit: SubmitHandler<EditBatchFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        name: data.name,
        classId: data.classId,
        startTime: data.startTime,
        endTime: data.endTime,
      };

      const res = await updateBatch(batchId, payload);
      if (res.statusCode === 200) {
        showSuccessToast(res.message || "Batch updated successfully!");
        form.reset();
        router.push("/dashboard/batches");
      } else {
        showErrorToast(res.message || "Failed to update batch.");
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
          <DoorOpenIcon className="h-4 w-4" />
          <span>Batches</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Edit Batch</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Batch</h1>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
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
                {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
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
            rules={{ required: "End time is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="time"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
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
                Update Batch
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

export default EditBatchForm;