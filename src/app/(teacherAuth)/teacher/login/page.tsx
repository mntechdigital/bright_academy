"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { teacherLogin } from "@/src/services/teacher";

type TTeacherLoginForm = {
  regNo: string;
  password: string;
};

export default function TeacherLoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TTeacherLoginForm>();

  const onSubmit = async (data: TTeacherLoginForm) => {
    setErrorMsg("");
    try {
      const result = await teacherLogin(data);

      if (result.statusCode === 200) {
        router.push("/dashboard");
      } else {
        setErrorMsg(result.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      setErrorMsg(error?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF1E7] px-4">
      <div className="w-full max-w-md rounded-3xl bg-[#FBF1E7] p-2 border-2 border-orange-200 shadow-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full rounded-3xl bg-[#FBF1E7] p-8 sm:p-10"
        >
          <h1 className="text-center text-4xl font-extrabold text-[#1B2A4A]">
            Teacher Log In
          </h1>
          <p className="mb-8 mt-2 text-center text-base text-slate-500">
            Student&apos;s Result Management System
          </p>

          {errorMsg && (
            <p className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
              {errorMsg}
            </p>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-base font-semibold text-[#1B2A4A]">
              Registration Number
            </label>
            <input
              type="text"
              placeholder="Enter your registration number...."
              {...register("regNo", {
                required: "Registration number is required",
              })}
              className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-3.5 text-slate-700 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none"
            />
            {errors.regNo && (
              <p className="mt-1 text-xs text-red-500">{errors.regNo.message}</p>
            )}
          </div>

          <div className="mb-8">
            <label className="mb-2 block text-base font-semibold text-[#1B2A4A]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password...."
                {...register("password", { required: "Password is required" })}
                className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-3.5 pr-12 text-slate-700 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 rounded-full border-2 border-orange-400 bg-transparent py-3 font-semibold text-orange-500 transition hover:bg-orange-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full bg-orange-500 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}