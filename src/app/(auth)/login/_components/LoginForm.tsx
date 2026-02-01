/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FieldValues, SubmitHandler, useForm, Controller } from "react-hook-form";
import Image from "next/image";
import footerbg from "../../../../public/footerbg.png";
import footerIcon from "../../../../public/footericon.png";
import footerRightImage from "../../../../public/Image (2).png";
import { showErrorToast, showSuccessToast } from "@/src/utils/toastMessage";
import { login } from "@/src/services/auth";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
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

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Login Form - 50% width */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white px-8">
        <div className="w-full max-w-md">
          {/* User Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#1F2937] rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <User className="text-white" size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-black tracking-[0.25em]">LOGIN</h2>
          </div>

          {/* Login Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full"
          >
            {/* Email Input */}
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center bg-white rounded-md shadow-md px-4 py-3 border border-gray-100">
                  <Mail className="text-gray-400 mr-3" size={20} />
                  <input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
                  />
                </div>
              )}
            />

            {/* Password Input */}
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center bg-white rounded-md shadow-md px-4 py-3 border border-gray-100">
                  <Lock className="text-gray-400 mr-3" size={20} />
                  <input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-sm"
                  />
                </div>
              )}
            />

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#D4A017] hover:bg-[#B8860B] text-white font-semibold py-3.5 rounded-md text-base shadow-lg transition-all duration-200 w-full mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Gradient Background with Image - 50% width */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8">
        {/* Background Image */}
        <Image
          src={footerbg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Main Content Card - Full width and height */}
        <div className="relative bg-white/20 backdrop-blur-sm rounded-[32px] shadow-2xl w-full h-full flex flex-col items-center justify-center p-12 z-10">
          {/* Lightning Icon - Left side */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
            <Image
              src={footerIcon}
              alt="Icon"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>

          {/* Text Content */}
          <div className="mb-8 text-center px-8">
            <h3 className="text-white text-3xl font-bold leading-snug">
              Very good works are waiting for you Login Now!!!
            </h3>
          </div>

          {/* Image Container */}
          <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl overflow-hidden bg-linear-to-br from-orange-400 to-yellow-400 shadow-2xl">
            <Image
              src={footerRightImage}
              alt="Happy person"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Lightning Icon - Bottom right */}
          <div className="absolute bottom-8 right-8 bg-white/70 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <Image
              src={footerIcon}
              alt="Icon"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;