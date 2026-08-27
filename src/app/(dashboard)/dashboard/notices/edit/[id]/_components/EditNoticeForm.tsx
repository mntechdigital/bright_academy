"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
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
  FileUp,
  File,
  Eye,
  EyeOff,
} from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { getNoticeById, updateNotice } from "@/src/services/notice";

interface EditNoticeFormValues {
  title: string;
  isPublished: boolean;
}

const EditNoticeForm = ({ noticeId }: { noticeId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string>("");
  const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditNoticeFormValues>({
    defaultValues: {
      title: "",
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
            isPublished: res.data.isPublished ?? true,
          });
          setExistingPdfUrl(res.data.pdfUrl || "");
        }
      } catch (error) {
        console.error("Failed to fetch notice:", error);
      }
    };
    fetchNotice();
  }, [noticeId, form]);

  useEffect(() => {
    return () => {
      if (newFilePreviewUrl) URL.revokeObjectURL(newFilePreviewUrl);
    };
  }, [newFilePreviewUrl]);

  const onSubmit: SubmitHandler<EditNoticeFormValues> = async (data) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("isPublished", String(data.isPublished));

      if (selectedFile) {
        formData.append("pdf", selectedFile);
      }

      const res = await updateNotice(noticeId, formData);
      if (res.statusCode === 200) {
        showSuccessToast(res.message || "Notice updated successfully!");
        form.reset();
        router.push("/dashboard/notices");
      } else {
        showErrorToast(res.message || "Failed to update notice.");
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
      if (newFilePreviewUrl) URL.revokeObjectURL(newFilePreviewUrl);
      const url = URL.createObjectURL(file);
      setNewFilePreviewUrl(url);
      setShowPreview(true);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (newFilePreviewUrl) URL.revokeObjectURL(newFilePreviewUrl);
    setNewFilePreviewUrl(null);
    setShowPreview(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const existingPdfPreviewUrl = existingPdfUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}/notices/${noticeId}/pdf`
    : "";

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

        {/* PDF Upload Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            PDF File
          </label>

          {/* Show existing PDF if no new file selected */}
          {existingPdfUrl && !selectedFile && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <File className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate flex-1">
                  Current PDF
                </span>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  {showPreview ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {showPreview && existingPdfPreviewUrl && (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src={existingPdfPreviewUrl}
                    className="w-full h-[500px]"
                    title="Current PDF Preview"
                  />
                </div>
              )}
            </div>
          )}

          {/* Show newly selected file */}
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
                  {showPreview ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              {showPreview && newFilePreviewUrl && (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <iframe
                    src={newFilePreviewUrl}
                    className="w-full h-[500px]"
                    title="New PDF Preview"
                  />
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F97316] hover:bg-orange-50/30 transition-all">
              <div className="flex flex-col items-center gap-2">
                <FileUp className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Click to upload new PDF
                </span>
                <span className="text-xs text-gray-400">
                  Leave empty to keep current PDF
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
