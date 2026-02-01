"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FieldValues, SubmitHandler, useForm, Controller } from "react-hook-form";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { login } from "@/src/services/auth";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    startTransition(async () => {
      const response = await login(data);
      if (response.statusCode === 200) {
        showSuccessToast(response.message);
        form.reset();
        router.push("/dashboard");
      } else {
        showErrorToast(response.message);
      }
    });
  };

  const handleCancel = () => {
    form.reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5EB] p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#FEF6F0] p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Log In</h1>
          <p className="mt-2 text-sm text-[#1E3A5F]/70">
            Student&apos;s Result Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1E3A5F]">
              Email
            </label>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Enter your mail...."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
              )}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1E3A5F]">
              Password
            </label>
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password...."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F97316] hover:text-[#EA580C]"
                  >
                    {showPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="flex-1 rounded-full border-2 border-[#F97316] bg-transparent py-3 font-semibold text-[#F97316] transition-all hover:bg-[#F97316]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-full bg-[#F97316] py-3 font-semibold text-white transition-all hover:bg-[#EA580C]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;