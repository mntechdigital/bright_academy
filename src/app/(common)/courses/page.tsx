import React from 'react'
import PageHeader from '../_components/PageHeader'
import HomeScheduleSection from '../_components/HomeScheduleSection'

const Coursespage = () => {
  return (
    <div>
      <PageHeader title="কোর্স সমুহ" breadcrumbs={["Home", "কোর্স সমুহ"]} />
      <HomeScheduleSection/>
    </div>
  )
}

export default Coursespage
