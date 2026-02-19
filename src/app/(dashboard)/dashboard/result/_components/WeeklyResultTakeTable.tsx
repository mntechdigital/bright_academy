"use client";
import React, { useTransition } from "react";
import { Student } from "./studentTableTypes";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const WeeklyResultTakeTable = ({
  studentsData,
  totalMark,
}: {
  studentsData: Student[];
  totalMark: number;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      obtainMark: "",
    },
  });

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      const payload = {
        obtainMark: data.obtainMark,
      };

      console.log("see student info==>", payload);

      // const res = await createStudent(payload);
      // console.log("registration std response==>",res)
      // if (res.statusCode === 201) {
      //   showSuccessToast("Student created successfully!");
      //   form.reset();
      //   router.push("/dashboard/students");
      // } else {
      //   showErrorToast(res.message || "Failed to create student.");
      // }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 my-10">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mr-3">Students</h2>
        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
          Class 6
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs">
              <th className="px-4 py-3 font-medium text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 font-medium text-left">
                Student's Name
              </th>
              <th className="px-4 py-3 font-medium text-left">Student's ID</th>
              <th className="px-4 py-3 font-medium text-left">
                Total Marks{" "}
                <span className="ml-1 cursor-pointer" title="Total marks">
                  &#9432;
                </span>
              </th>
              <th className="px-4 py-3 font-medium text-left">
                Obtain Marks{" "}
                <span className="ml-1 cursor-pointer" title="Obtain marks">
                  &#9432;
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {studentsData.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {student.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.username}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                    {student.studentId}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 text-sm font-medium">
                  {totalMark}
                </td>
                <td className="px-4 py-3 text-gray-900 text-sm font-medium">
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="obtainMark"
                        control={form.control}
                        rules={{ required: "Obtain mark is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <div className="flex flex-col">
                            <input
                              {...field}
                              type="text"
                              placeholder="Enter obtain mark"
                              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                            />
                            {error && (
                              <p className="mt-1 text-sm text-red-500">
                                {error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-lg bg-[#F97316] px-4 py-3 font-semibold text-white transition-all hover:bg-[#EA580C] h-12 cursor-pointer whitespace-nowrap"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            submit
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyResultTakeTable;
