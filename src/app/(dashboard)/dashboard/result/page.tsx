import React from 'react'
import { DashboardWrapper } from '../_components/DashboardWrapper'
import GiveResult from './_components/GiveResult'
import { getClasses } from '@/src/services/classes'

const ResultOverviewPage = async () => {
  const classesRes = await getClasses([]);
  const classesData = classesRes?.data?.data;

  return (
    <DashboardWrapper>
        <GiveResult classesData={classesData}/>
    </DashboardWrapper>
  )
}

export default ResultOverviewPage
