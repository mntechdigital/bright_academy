import React from 'react'
import PageHeader from '../_components/PageHeader'
import HomeAboutSection from '../_components/HomeAboutSection'

const Aboutpage = () => {
  return (
    <div>
      <PageHeader title="আমাদের সম্পর্কে" breadcrumbs={["Home", "আমাদের সম্পর্কে"]} />
      <HomeAboutSection/>
    </div>
  )
}

export default Aboutpage
