import React from 'react'
import HomepageHeroSection from './_components/HomepageHeroSection'
import HomeAboutSection from './_components/HomeAboutSection'
import HomeScheduleSection from './_components/HomeScheduleSection'
import HomeDirectorSection from './_components/HomeDirectorSection'
import HomepageTestimonialSection from './_components/HomepageTestimonialSection'
import HomepageNewsSection from './_components/HomepageNewsSection'
import Topber from '../../../src/components/shared/Topber'

const Home = () => {
  return (
    <div>
      <Topber />
      <HomepageHeroSection/>
      <HomeAboutSection/>
      <HomeScheduleSection/>
      <HomeDirectorSection/>
      <HomepageTestimonialSection/>
      <HomepageNewsSection/>
    </div>
  )
}

export default Home
