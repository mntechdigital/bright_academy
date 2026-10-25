"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResultModeSwitch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "weekly" ? "weekly" : "monthly";

  const switchTo = (next: "monthly" | "weekly") => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "monthly") params.delete("mode");
    else params.set("mode", "weekly");
    params.set("page", "1");
    router.push(`/dashboard/result?${params.toString()}`);
  };

  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 mb-5">
      <button
        onClick={() => switchTo("monthly")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "monthly" ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
      >
        Monthly
      </button>
      <button
        onClick={() => switchTo("weekly")}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "weekly" ? "bg-orange-500 text-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}
      >
        Weekly
      </button>
    </div>
  );
}
