import React from 'react'
import PageHeader from '../_components/PageHeader'
import HomeDirectorSection from '../_components/HomeDirectorSection'

const page = () => {
  return (
    <div>
      <PageHeader title="শিক্ষকমণ্ডলী" breadcrumbs={["Home", "শিক্ষকমণ্ডলী"]} />
      <HomeDirectorSection/>
    </div>
  )
}

export default page
