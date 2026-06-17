import React from 'react'
import PageHeader from '../_components/PageHeader'
import TestimonialsSection from './_components/TestimonialsSection'

const Reviewpage = () => {
  return (
    <div>
        <PageHeader title="শিক্ষার্থীদের মতামত" breadcrumbs={["Home", "শিক্ষার্থীদের মতামত"]}/>
        <div className="py-8">
          <TestimonialsSection/>
        </div>
    </div>
  )
}

export default Reviewpage
