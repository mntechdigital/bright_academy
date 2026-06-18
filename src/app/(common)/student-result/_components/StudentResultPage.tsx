"use client";

import { useEffect, useState } from "react";
import { getMyResults } from "@/src/services/students";

export default function StudentResultPage() {
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getMyResults();

        console.log("========== BACKEND RESPONSE ==========");
        console.log(res);

        setResultData(res);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Backend Response
        </h1>

        <p className="text-gray-500">
          Open Browser Console (F12) and check the response.
        </p>
      </div>

      <div className="rounded-lg border bg-gray-50 p-4 overflow-auto">
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(resultData, null, 2)}
        </pre>
      </div>
    </div>
  );
}