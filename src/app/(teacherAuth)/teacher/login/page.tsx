
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { teacherLogin } from "@/src/services/teacher";

type TTeacherLoginForm = {
  regNo: string;
  password: string;
};

export default function TeacherLoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Teacher Login
        </h1>

        {errorMsg && (
          <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">
            {errorMsg}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            placeholder="bright-001"
            {...register("regNo", { required: "Registration number is required" })}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          {errors.regNo && (
            <p className="mt-1 text-xs text-red-500">{errors.regNo.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}