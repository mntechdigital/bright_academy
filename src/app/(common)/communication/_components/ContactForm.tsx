"use client";

import React from "react";
import { useForm } from "react-hook-form";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  message: string;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>();

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === "object" && "message" in error) {
      const message = (error as { message?: unknown }).message;
      return typeof message === "string" ? message : "";
    }

    return "";
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    reset();
  };

  const inputClass = (hasError: boolean) =>
    `w-full border rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 ${
      hasError ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <section className="w-full">
      <div className="w-full bg-white rounded-2xl">

        {/* Heading */}
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-10 tracking-tight">
          আমাদের একটি বার্তা{" "}
          <span className="text-orange-400">পাঠান</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Row 1: Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">আপনার নাম</label>
              <input
                type="text"
                placeholder="আপনার নাম"
                className={inputClass(!!errors.name)}
                {...register("name", { required: "নাম আবশ্যক" })}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{getErrorMessage(errors.name)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">ইমেইল</label>
              <input
                type="email"
                placeholder="ইমেইল"
                className={inputClass(!!errors.email)}
                {...register("email", {
                  required: "ইমেইল আবশ্যক",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "সঠিক ইমেইল দিন" },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{getErrorMessage(errors.email)}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone + Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">ফোন নম্বর</label>
              <input
                type="tel"
                placeholder="ফোন নম্বর"
                className={inputClass(!!errors.phone)}
                {...register("phone", { required: "ফোন নম্বর আবশ্যক" })}
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">{getErrorMessage(errors.phone)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">ঠিকানা</label>
              <input
                type="text"
                placeholder="ঠিকানা"
                className={inputClass(!!errors.address)}
                {...register("address")}
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-sm text-gray-700 mb-2">আপনার বার্তা</label>
            <textarea
              placeholder="আপনার বার্তা"
              rows={7}
              className={`${inputClass(!!errors.message)} resize-none`}
              {...register("message", { required: "বার্তা আবশ্যক" })}
            />
            {errors.message && (
              <p className="text-xs text-red-400 mt-1">{getErrorMessage(errors.message)}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center gap-0 bg-orange-400 hover:bg-orange-500 active:scale-95 transition-all text-white font-semibold rounded-lg overflow-hidden"
          >
            <span className="px-5 py-3 text-sm">বার্তা জমা দিন</span>
            <span className="bg-orange-500 px-4 py-3 flex items-center justify-center self-stretch">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;