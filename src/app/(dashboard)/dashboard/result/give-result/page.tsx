import React from 'react'
import { DashboardWrapper } from '../../_components/DashboardWrapper'
import GiveResult from '../_components/GiveResult'
import { getClasses } from '@/src/services/classes';
import { getWeeklyResults } from '@/src/services/weeklyResult';
import { TQuery } from '@/src/types/query.types';
import { getStudents } from '@/src/services/students';

const GiveResultpage = async(props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;

  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;

  const weeklyResultsRes = await getWeeklyResults([]);
  const weeklyResultsData = weeklyResultsRes?.data?.data || [];

  // Get the first weekly result meta to filter students by class and batch
  const weeklyResultMeta = weeklyResultsData[0];

  
    const query: TQuery[] = [
      {
        key: "orderBy",
        value: JSON.stringify({ createdAt: "desc" }),
      },
      {
        key: "searchTerm",
        value: search,
      },
      {
        key: "page",
        value: page.toString(),
      },
      {
        key: "limit",
        value: "10",
      },
      // ✅ Filter students by classId and batchId from weekly result
      // ✅ Use "filter" key with JSON stringified object
    ...(weeklyResultMeta?.stdClassId && weeklyResultMeta?.batchId
      ? [
          {
            key: "filter",
            value: JSON.stringify({
              classId: weeklyResultMeta.stdClassId,
              batchId: weeklyResultMeta.sectionId,
            }),
          },
        ]
      : []),
    ];
  
    const studentRes = await getStudents(query);
    const studentData = studentRes?.data?.data || [];

  return (
    <DashboardWrapper>
        <GiveResult classesData={classesData}/>
    </DashboardWrapper>
  )
}

export default GiveResultpage
