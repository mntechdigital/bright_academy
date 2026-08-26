"use client";

import React, { useRef, useState, useTransition } from "react";
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
  FileUp,
  File,
  X,
  Eye,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { createNotice } from "@/src/services/notice";

interface CreateNoticeFormValues {
  title: string;
  pdf: FileList;
}

const CreateNoticeForm = () => {
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateNoticeFormValues>({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit: SubmitHandler<CreateNoticeFormValues> = async (data) => {
    if (!selectedFile) {
      showErrorToast("Please select a PDF file");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("pdf", selectedFile);

      const res = await createNotice(formData);
      console.log("create notice res==>", res);
      if (res.statusCode === 201) {
        showSuccessToast("Notice created successfully!");
        form.reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setShowPreview(false);
        router.push("/dashboard/notices");
      } else {
        showErrorToast(res.message || "Failed to create notice.");
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showErrorToast("Only PDF files are allowed");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showErrorToast("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowPreview(true);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowPreview(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

        {/* PDF Upload Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            PDF File<span className="text-red-500">*</span>
          </label>
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <File className="h-5 w-5 text-[#F97316] shrink-0" />
                <span className="text-sm text-gray-700 truncate flex-1">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              {showPreview && previewUrl && (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src={previewUrl}
                    className="w-full h-[500px]"
                    title="PDF Preview"
                  />
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F97316] hover:bg-orange-50/30 transition-all">
              <div className="flex flex-col items-center gap-2">
                <FileUp className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Click to upload PDF
                </span>
                <span className="text-xs text-gray-400">
                  Max size: 10MB
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
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
