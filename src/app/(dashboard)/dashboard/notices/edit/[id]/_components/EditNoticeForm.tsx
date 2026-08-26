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
  Bell,
  X,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getNoticeById, updateNotice } from "@/src/services/notice";

interface EditNoticeFormValues {
  title: string;
  pdfUrl: string;
  isPublished: boolean;
}

const EditNoticeForm = ({ noticeId }: { noticeId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditNoticeFormValues>({
    defaultValues: {
      title: "",
      pdfUrl: "",
      isPublished: true,
    },
  });

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await getNoticeById(noticeId);
        if (res?.data) {
          form.reset({
            title: res.data.title || "",
            pdfUrl: res.data.pdfUrl || "",
            isPublished: res.data.isPublished ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch notice:", error);
      }
    };
    fetchNotice();
  }, [noticeId, form]);

  const onSubmit: SubmitHandler<EditNoticeFormValues> = async (data) => {
    startTransition(async () => {
      const payload = {
        title: data.title,
        pdfUrl: data.pdfUrl,
        isPublished: data.isPublished,
      };

      const res = await updateNotice(noticeId, payload);
      if (res.statusCode === 200) {
        showSuccessToast(res.message || "Notice updated successfully!");
        form.reset();
        router.push("/dashboard/notices");
      } else {
        showErrorToast(res.message || "Failed to update notice.");
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
          href="/dashboard/notices"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span>Notices</span>
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Edit Notice</span>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit Notice</h1>

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

        {/* Is Published Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Published
          </label>
          <Controller
            name="isPublished"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    field.value ? "bg-[#F97316]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      field.value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {field.value ? "Published" : "Draft"}
                </span>
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
                Update Notice
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

export default EditNoticeForm;
