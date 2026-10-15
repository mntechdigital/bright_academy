import React from 'react'
import RoutinePage from './_components/RoutinePage'
import PageHeader from '../_components/PageHeader'

const page = () => {
  return (
    <>
      <PageHeader title="পরীক্ষার রুটিন" breadcrumbs={["Home", "রুটিন"]} />
      <div className='max-w-7xl mx-auto p-4 mb-10'>
        <RoutinePage />
      </div>
    </>
  )
}

export default page
