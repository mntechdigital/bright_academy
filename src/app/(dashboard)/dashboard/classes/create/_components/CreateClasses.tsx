"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ChevronRight, Plus, Loader2, DoorOpenIcon } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { createClasses } from "@/src/services/classes";

interface CreateClassFormValues {
  className: string;
}

const CreateClasses = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateClassFormValues>({
    defaultValues: {
      className: "",
    },
  });

  const onSubmit: SubmitHandler<CreateClassFormValues> = async (data) => {
    startTransition(async () => {
      const payload: CreateClassFormValues = {
        ...data,
      };
      const res = await createClasses(payload);
      if (res.statusCode === 201) {
        showSuccessToast("Class created successfully!");
        form.reset();
      } else {
        showErrorToast(res.message || "Failed to create class.");
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Create Class</h1>

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
              Create Class
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateClasses;
