import React from "react";
import { BookOpen, GraduationCap, School } from "lucide-react";

interface DashboardOverviewProps {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
}

export default function DashboardOverview({
  totalTeachers = 0,
  totalStudents = 0,
  totalClasses = 0,
}: DashboardOverviewProps) {
  const stats = [
    {
      title: "Total Teacher",
      value: totalTeachers.toString(),
      icon: BookOpen,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Total Students",
      value: totalStudents.toString(),
      icon: GraduationCap,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Total Classes",
      value: totalClasses.toString(),
      icon: School,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex items-center justify-between group hover:scale-105"
            >
              <div className="flex flex-col">
                <h3 className="text-gray-500 text-base font-medium mb-2">
                  {stat.title}
                </h3>
                <p className="text-5xl font-bold text-orange-500 group-hover:text-orange-600 transition-colors">
                  {stat.value}
                </p>
              </div>

              <div
                className={`${stat.bgColor} rounded-full p-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon
                  className={`w-10 h-10 ${stat.iconColor}`}
                  strokeWidth={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
