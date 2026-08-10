/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  getWeeklyResults,
  getWeeklyResultsByFilters,
} from "@/src/services/weeklyResult";
import { getStudents } from "@/src/services/students";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import WeeklyResultTable from "./WeeklyResultTable";
import WeeklyResultTakeTable from "./WeeklyResultTakeTable";

// Normalize week value
const normalizeWeek = (week?: string) => {
  if (!week) return undefined;

  const cleaned = week.trim().replace(/\s+/g, " ");

  if (/^Week\s+\d+$/i.test(cleaned)) {
    return cleaned;
  }

  return `Week ${cleaned}`;
};

interface WeeklyResultProps {
  searchParams: { search: string; page: string };
  refreshTrigger?: number;
  formData?: any;
}

const WeeklyResult: React.FC<WeeklyResultProps> = ({
  searchParams,
  refreshTrigger = 0,
  formData,
}) => {
  const [weeklyResultsData, setWeeklyResultsData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [studentMeta, setStudentMeta] = useState({
    totalPages: 1,
    totalItems: 0,
  });

  const [selectedResult, setSelectedResult] = useState<any>(null);

  const search = searchParams.search || "";

  // Use formData from props instead of localStorage
  const formDataFromStorage = formData;

  // Reset data when formData changes
  useEffect(() => {
    setWeeklyResultsData([]);
    setStudentData([]);
    setSelectedResult(null);
  }, [formData]);

  // Use students from formData if available, otherwise fetch them
  const studentsFromForm = formDataFromStorage?.students || [];

  // Fetch weekly results
  useEffect(() => {
    const fetchWeeklyResults = async () => {
      let data: any[] = [];

      try {
        if (formDataFromStorage?.stdClassId && formDataFromStorage?.subjectId) {
          const weekValue = normalizeWeek(formDataFromStorage.week);

          const payload = {
            stdClassId: String(formDataFromStorage.stdClassId),
            batchId: formDataFromStorage.batchId
              ? String(formDataFromStorage.batchId)
              : undefined,
            subjectId: String(formDataFromStorage.subjectId),
            week: weekValue,
            month: String(formDataFromStorage.month),
            year: String(formDataFromStorage.year),
          };

          console.log("FILTER PAYLOAD =>", payload);

          const res = await getWeeklyResultsByFilters(payload);

          console.log("FILTER RESPONSE =>", res);

          data = res?.data?.data || [];
        } else {
          // Fetch all weekly results when no formData (page load/refresh)
          const res = await getWeeklyResults([]);
          data = res?.data?.data || [];
        }

        console.log("FINAL WEEKLY DATA =>", data);

        setWeeklyResultsData(data);

        // Only auto-select if no result is currently selected
        setSelectedResult((prevSelected: any) => {
          if (data.length > 0 && !prevSelected) {
            return data[0];
          }
          return prevSelected;
        });
      } catch (error) {
        console.error("Error fetching weekly results", error);
      }
    };

    fetchWeeklyResults();
  }, [refreshTrigger, formDataFromStorage]);

  // Selected result metadata
  const weeklyResultMeta = useMemo(() => {
    if (selectedResult) return selectedResult;

    if (weeklyResultsData.length > 0) return weeklyResultsData[0];

    if (formDataFromStorage) {
      return {
        id: "new-result",
        week: normalizeWeek(formDataFromStorage.week),
        month: formDataFromStorage.month,
        year: formDataFromStorage.year,
        publishedDate: formDataFromStorage.publishedDate,
        totalMarks: formDataFromStorage.totalMarks,
        stdClass: {
          id: formDataFromStorage.stdClassId,
          className: formDataFromStorage.className || "",
        },
        batch: {
          id: formDataFromStorage.batchId,
          name: formDataFromStorage.batchName || "",
        },
        subject: {
          id: formDataFromStorage.subjectId,
          subjectName: formDataFromStorage.subjectName || "",
        },
      };
    }

    return null;
  }, [selectedResult, weeklyResultsData, formDataFromStorage]);

  // Filter active weekly results
  const activeWeeklyResults = useMemo(() => {
    if (!weeklyResultMeta) return [];

    return weeklyResultsData.filter((result) => {
      return (
        String(result.stdClass?.id) === String(weeklyResultMeta.stdClass?.id) &&
        String(result.subject?.id) === String(weeklyResultMeta.subject?.id) &&
        String(result.week) === String(weeklyResultMeta.week) &&
        String(result.month) === String(weeklyResultMeta.month) &&
        String(result.year) === String(weeklyResultMeta.year) &&
        String(result.batch?.id || result.batchId || "") ===
          String(weeklyResultMeta.batch?.id || weeklyResultMeta.batchId || "")
      );
    });
  }, [weeklyResultsData, weeklyResultMeta]);

  // Fetch students when weeklyResultMeta changes
  useEffect(() => {
    const classId = weeklyResultMeta?.stdClass?.id;

    if (!classId) return;

    // If students are already provided from form, use them
    if (studentsFromForm.length > 0) {
      setStudentData(studentsFromForm);
      setStudentMeta({
        totalPages: 1,
        totalItems: studentsFromForm.length,
      });
      return;
    }

    // Otherwise fetch from API
    const fetchStudents = async () => {
      try {
        const query: TQuery[] = [
          {
            key: "orderBy",
            value: JSON.stringify({ createdAt: "desc" }),
          },
          { key: "searchTerm", value: search },
          { key: "page", value: "1" },
          { key: "limit", value: "1000" },
          { key: "filter", value: JSON.stringify({ classId }) },
        ];

        const studentRes = await getStudents(query);
        const allStudents = studentRes?.data?.data || [];

        const batchId =
          weeklyResultMeta?.batch?.id || weeklyResultMeta?.batchId;

        const filteredStudents = batchId
          ? allStudents.filter((student: any) => {
              const studentBatchId = student.batch?.id || student.batchId || "";
              return String(studentBatchId) === String(batchId);
            })
          : allStudents;

        console.log("STUDENTS FETCHED IN WEEKLYRESULT:", filteredStudents);
        
        setStudentData(filteredStudents);
        setStudentMeta({
          totalPages: 1,
          totalItems: filteredStudents.length,
        });
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };

    fetchStudents();
  }, [weeklyResultMeta, search, studentsFromForm]);

  // Dropdown selection
  const handleCardClick = useCallback((result: any) => {
    console.log("SELECTED RESULT =>", result);
    setSelectedResult(result);
  }, []);

  // Refresh after delete
  const handleCardDelete = useCallback(async () => {
    let data: any[] = [];

    try {
      if (formDataFromStorage?.stdClassId && formDataFromStorage?.subjectId) {
        const weekValue = normalizeWeek(formDataFromStorage.week);

        const res = await getWeeklyResultsByFilters({
          stdClassId: formDataFromStorage.stdClassId,
          batchId: formDataFromStorage.batchId,
          subjectId: formDataFromStorage.subjectId,
          week: weekValue,
          month: formDataFromStorage.month,
          year: formDataFromStorage.year,
        });

        data = res?.data?.data || [];
      } else {
        const res = await getWeeklyResults([]);
        data = res?.data?.data || [];
      }

      setWeeklyResultsData(data);

      if (data.length > 0) {
        setSelectedResult(data[0]);
      } else {
        setSelectedResult(null);
        setStudentData([]);
        setStudentMeta({
          totalPages: 1,
          totalItems: 0,
        });
      }
    } catch (error) {
      console.error("Error refreshing weekly results", error);
    }
  }, [formDataFromStorage]);

  return (
    <DashboardWrapper>
      <WeeklyResultTable
        weeklyResults={weeklyResultsData}
        selectedCard={selectedResult}
        onCardClick={handleCardClick}
        onDeleteSuccess={handleCardDelete}
      />

      {weeklyResultMeta && (
        <WeeklyResultTakeTable
          key={`${weeklyResultMeta.week}-${weeklyResultMeta.month}-${weeklyResultMeta.year}-${weeklyResultMeta.subject?.id}`}
          studentsData={studentData}
          weeklyResults={activeWeeklyResults}
          weeklyResultMeta={weeklyResultMeta}
        />
      )}

      {studentMeta.totalPages > 1 && (
        <PaginationWrapper
          active={parseInt(searchParams.page) || 1}
          totalPages={studentMeta.totalPages}
          totalItems={studentMeta.totalItems}
        />
      )}
    </DashboardWrapper>
  );
};

export default WeeklyResult;
