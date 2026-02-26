import React from 'react'
import { DashboardWrapper } from '../../../_components/DashboardWrapper'
import EditPageProps from '@/src/types/params.interface';
import { getMonthlyResultById, updateMonthlyResult } from '@/src/services/monthlyResult';

const EditMonthlyResultpage = async({ params }: EditPageProps) => {
    const { id } = await params;
    const getMonthlyResultRes = await getMonthlyResultById(id);
    console.log("single result==>",getMonthlyResultRes.data);
  return (
    <DashboardWrapper>
        <h1>Edit Monthly Result: {id}</h1>
    </DashboardWrapper>
  )
}

export default EditMonthlyResultpage
