"use client";

import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { updateTeacher } from "@/src/services/teacher";

interface UpdatePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Teacher {
  id: string;
  name: string;
  regNo: string;
  password?: string;
}

interface Props {
  teacher: Teacher;
}

export default function UpdateTeacherPassword({ teacher }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordFormValues>({
    mode: "onBlur",
    defaultValues: {
      currentPassword: teacher.password || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit: SubmitHandler<UpdatePasswordFormValues> = async (data) => {
    // Validate password strength
    if (data.newPassword.length < 8) {
      showErrorToast("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(data.newPassword)) {
      showErrorToast(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(data.newPassword)) {
      showErrorToast(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (!/[0-9]/.test(data.newPassword)) {
      showErrorToast("Password must contain at least one number.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      const res = await updateTeacher(teacher.id, payload);

      if (res.statusCode === 200 || res.statusCode === 201) {
        showSuccessToast("Password updated successfully!");
        reset();
        router.push("/dashboard/teachers");
      } else {
        showErrorToast(
          res.message || "Failed to update password. Please try again."
        );
      }
    } catch (error) {
      showErrorToast("An error occurred while updating password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        <span>Back</span>
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Change Password
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Update your password to keep your account secure
      </p>

      {/* Teacher Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1">Teacher Name</p>
            <h2 className="text-lg font-bold text-gray-900">{teacher.name}</h2>
            <p className="text-sm text-gray-600 mt-1">ID: {teacher.regNo}</p>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password<span className="text-red-500">*</span>
            </label>
            <Controller
              name="currentPassword"
              control={control}
              rules={{ required: "Current password is required" }}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              )}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password<span className="text-red-500">*</span>
            </label>
            <Controller
              name="newPassword"
              control={control}
              rules={{ required: "New password is required" }}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              )}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
            {newPassword && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-600 font-medium">
                  Password Requirements:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li
                    className={
                      newPassword.length >= 8
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ At least one uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ At least one lowercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ At least one number
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password<span className="text-red-500">*</span>
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              }}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              )}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => {
              reset();
              router.push("/dashboard/teachers");
            }}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
