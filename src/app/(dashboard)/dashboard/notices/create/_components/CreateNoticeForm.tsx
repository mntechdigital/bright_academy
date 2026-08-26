"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ChevronRight,
  Plus,
  Loader2,
  Bell,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { createNotice } from "@/src/services/notice";

interface CreateNoticeFormValues {
  title: string;
  pdfUrl: string;
}

const CreateNoticeForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateNoticeFormValues>({
    defaultValues: {
      title: "",
      pdfUrl: "",
    },
  });

  const onSubmit: SubmitHandler<CreateNoticeFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        title: data.title,
        pdfUrl: data.pdfUrl,
      };
      const res = await createNotice(payload);
      console.log("Create Notice Response:", res);
      if (res.statusCode === 201) {
        showSuccessToast("Notice created successfully!");
        form.reset();
        router.push("/dashboard/notices");
      } else {
        showErrorToast(res.message || "Failed to create notice.");
      }
    });
  };

  const router = useRouter();

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
          href="/dashboard/notices"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span>Notices</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Create Notice</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Create Notice</h1>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-full">
        {/* Notice Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Notice Title<span className="text-red-500">*</span>
          </label>
          <Controller
            name="title"
            control={form.control}
            rules={{ required: "Notice title is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="text"
                  placeholder="Monthly Exam Routine"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* PDF URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            PDF URL<span className="text-red-500">*</span>
          </label>
          <Controller
            name="pdfUrl"
            control={form.control}
            rules={{ required: "PDF URL is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  {...field}
                  type="url"
                  placeholder="https://example.com/routine.pdf"
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
              Create Notice
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateNoticeForm;
