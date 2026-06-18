"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginStudent } from "@/src/services/students";

export default function StudentLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!userId || !password) {
      setError("User Id এবং Password দিন");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await loginStudent({ userId, password });

      if (!res?.success) {
        setError(res?.message || "Login ব্যর্থ হয়েছে");
        return;
      }

      // Login সফল — result page-এ যান
      router.push("/student-result");
    } catch {
      setError("Server-এ সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserId("");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div
        className="w-full max-w-xl bg-orange-50 rounded-3xl p-10"
        style={{ border: "1.5px solid #f3d5b5" }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Student's Login
          </h1>
          <p className="text-sm text-gray-500">View Result</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* User Id */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-sm font-medium text-gray-700">User Id</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User Id...."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 mb-8">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter password...."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}