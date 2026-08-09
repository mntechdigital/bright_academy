"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { getWeeklyResults } from "@/src/services/weeklyResult";
import { getStudents } from "@/src/services/students";
import PaginationWrapper from "@/src/components/PaginationWrapper";
import { TQuery } from "@/src/types/query.types";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";
import WeeklyResultTable from "./WeeklyResultTable";
import WeeklyResultTakeTable from "./WeeklyResultTakeTable";

interface WeeklyResultProps {
  searchParams: { search: string; page: string };
  refreshTrigger?: number;
  forceUpdateKey?: number;
}

const WeeklyResult: React.FC<WeeklyResultProps> = ({ searchParams, refreshTrigger = 0, forceUpdateKey = 0 }) => {
  const [weeklyResultsData, setWeeklyResultsData] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [studentMeta, setStudentMeta] = useState<{ totalPages: number; totalItems: number }>({ totalPages: 1, totalItems: 0 });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [formDataFromStorage, setFormDataFromStorage] = useState<any>(null);

  const search = searchParams.search || "";

  // Check localStorage for form data
  useEffect(() => {
    console.log("Checking localStorage for form data...");
    const stored = localStorage.getItem('weeklyResultFormData');
    console.log("Stored data:", stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("Parsed form data:", parsed);
        setFormDataFromStorage(parsed);
      } catch (e) {
        console.error('Error parsing stored form data:', e);
      }
    } else {
      setFormDataFromStorage(null);
    }
  }, [refreshTrigger, forceUpdateKey]);

  // Fetch weekly results when mount or refreshTrigger changes
  useEffect(() => {
    const fetchWeeklyResults = async () => {
      const res = await getWeeklyResults([]);
      console.log('Fetched Weekly Results:', res);
      const data = res?.data?.data || [];
      setWeeklyResultsData(data);

      // Auto-select the first card only on initial load
      if (data.length > 0 && !selectedCardId) {
        setSelectedCardId(data[0].id);
      }
    };
    fetchWeeklyResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Derive selected card from ID
  const selectedCard = useMemo(() => {
    if (!selectedCardId || weeklyResultsData.length === 0) return null;
    return weeklyResultsData.find((r) => r.id === selectedCardId) || null;
  }, [selectedCardId, weeklyResultsData]);

  // Calculate weekly result meta - prioritize form data from localStorage
  const weeklyResultMeta = useMemo(() => {
    console.log("Calculating weeklyResultMeta:", { formDataFromStorage, selectedCard, weeklyResultsDataLength: weeklyResultsData.length });
    
    // If we have form data from localStorage, use it (this is the newly created result)
    if (formDataFromStorage) {
      console.log("Using form data from localStorage");
      return {
        id: 'new-result',
        week: formDataFromStorage.week,
        month: formDataFromStorage.month,
        year: formDataFromStorage.year,
        publishedDate: formDataFromStorage.publishedDate,
        totalMarks: formDataFromStorage.totalMarks,
        stdClass: { id: formDataFromStorage.stdClassId, className: formDataFromStorage.className || '' },
        batch: { id: formDataFromStorage.batchId, name: formDataFromStorage.batchName || '' },
        subject: { id: formDataFromStorage.subjectId, subjectName: formDataFromStorage.subjectName || '' },
      };
    }
    // Otherwise use selected card or first available result
    if (selectedCard) {
      console.log("Using selected card");
      return selectedCard;
    }
    if (weeklyResultsData.length > 0) {
      console.log("Using first weekly result");
      return weeklyResultsData[0];
    }
    console.log("No meta available");
    return null;
  }, [formDataFromStorage, selectedCard, weeklyResultsData]);

  // Calculate active weekly results based on selected card
  const activeWeeklyResults = useMemo(() => {
    if (!weeklyResultMeta || weeklyResultsData.length === 0) {
      return [];
    }
    return weeklyResultsData.filter((result) => {
      return (
        String(result.stdClass?.id) === String(weeklyResultMeta.stdClass?.id) &&
        String(result.subject?.id) === String(weeklyResultMeta.subject?.id) &&
        String(result.week) === String(weeklyResultMeta.week) &&
        String(result.month) === String(weeklyResultMeta.month) &&
        String(result.year) === String(weeklyResultMeta.year) &&
        String(result.batch?.id || result.batchId || "") === String(weeklyResultMeta.batch?.id || weeklyResultMeta.batchId || "")
      );
    });
  }, [weeklyResultMeta, weeklyResultsData]);

  // Fetch students when selectedCard or formDataFromStorage changes
  useEffect(() => {
    console.log("Fetching students...", { selectedCard, formDataFromStorage });
    const classId = selectedCard?.stdClass?.id || formDataFromStorage?.stdClassId;
    console.log("Class ID:", classId);
    if (!classId) {
      console.log("No classId, returning early");
      return;
    }

    const fetchStudents = async () => {
      const query: TQuery[] = [
        { key: "orderBy", value: JSON.stringify({ createdAt: "desc" }) },
        { key: "searchTerm", value: search },
        { key: "page", value: "1" },
        { key: "limit", value: "1000" },
        { key: "filter", value: JSON.stringify({ classId }) },
      ];

      const studentRes = await getStudents(query);
      const allStudents: any[] = studentRes?.data?.data || [];
      console.log("Fetched students:", allStudents.length);

      // Compute active results
      const activeResults = weeklyResultsData.filter((r: any) => {
        const card = selectedCard || formDataFromStorage;
        if (!card) return false;
        return (
          String(r.stdClass?.id) === String(card.stdClassId || classId) &&
          String(r.subject?.id) === String(card.subjectId) &&
          String(r.week) === String(card.week) &&
          String(r.month) === String(card.month) &&
          String(r.year) === String(card.year) &&
          String(r.batch?.id || r.batchId || "") === String(card.batchId || "")
        );
      });

      // Get batch ID
      const batchId = selectedCard?.batch?.id || selectedCard?.batchId || formDataFromStorage?.batchId ||
        (activeResults.length > 0 ? activeResults[0]?.student?.batchId : null);

      const filteredByBatch = batchId
        ? allStudents.filter((s: any) => {
            const studentBatchId = s.batch?.id || s.batchId || "";
            return String(studentBatchId) === String(batchId);
          })
        : allStudents;

      console.log("Filtered students by batch:", filteredByBatch.length);
      setStudentData(filteredByBatch);
      setStudentMeta({
        totalPages: 1,
        totalItems: filteredByBatch.length || 0,
      });
    };
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard, formDataFromStorage]);

  const handleCardClick = useCallback((card: any) => {
    setSelectedCardId(card.id);
  }, []);

  const handleCardDelete = useCallback(() => {
    const fetchWeeklyResults = async () => {
      const res = await getWeeklyResults([]);
      const data = res?.data?.data || [];
      setWeeklyResultsData(data);

      if (data.length > 0) {
        setSelectedCardId(data[0].id);
      } else {
        setSelectedCardId(null);
        setStudentData([]);
        setStudentMeta({ totalPages: 1, totalItems: 0 });
      }
    };
    fetchWeeklyResults();
  }, []);

  return (
    <DashboardWrapper>
      <WeeklyResultTable 
        weeklyResults={weeklyResultsData}
        selectedCard={selectedCard}
        onCardClick={handleCardClick}
        onDeleteSuccess={handleCardDelete}
      />
      {console.log("Rendering check:", { weeklyResultMeta: !!weeklyResultMeta, studentDataLength: studentData.length })}
      {weeklyResultMeta && (
        <WeeklyResultTakeTable
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