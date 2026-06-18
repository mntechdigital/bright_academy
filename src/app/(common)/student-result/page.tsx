import React from 'react'
import StudentResultPage from './_components/StudentResultPage'
import PageHeader from '../_components/PageHeader'

const page = () => {
  return (
    <>
      <PageHeader title="Result" breadcrumbs={["Home", "Result"]} />
      <div className='max-w-7xl mx-auto p-4 mb-10'>
        <StudentResultPage />
      </div>
    </>
  )
}

export default page
