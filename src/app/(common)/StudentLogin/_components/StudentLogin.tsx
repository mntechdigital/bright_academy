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

      // ✅ Student data
      const student = res.data.student;

      // ✅ Save student info in cookie
      document.cookie = `studentInfo=${encodeURIComponent(
        JSON.stringify({
          id: student.id,
          name: student.name,
          stdRegNo: student.stdRegNo,
          stdClass: {
            id: student.stdClass?.id,
            className: student.stdClass?.className,
          },
        })
      )}; path=/; max-age=${60 * 60 * 24 * 7}`;

      // ✅ Save token (optional)
      localStorage.setItem("studentToken", res.data.token);

      //debugging
      

      // ✅ Redirect
      router.push("/student-result");
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Student Login
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Login to view your result
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-70"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}