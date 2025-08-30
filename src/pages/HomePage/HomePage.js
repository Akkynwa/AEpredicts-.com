import React from 'react'
import HeroSection from './HeroSection'
import EplMatchCard from './EplMatchCard'
import LaligaMatchCard from './LaligaMatchCard'
import SerieAMatchCard from './SerieAMatchCard'
import FranceLeague1MatchCard from './FranceLeague1MatchCard'
import OtherMatchCard from './OtherMatchCard'
import BundesligaMatchCard from './BundesligaMatchCard'
// import FranceMatchCard from './FranceLeague1'

const HomePage = () => {
    
  return (
    <div>
        <HeroSection />
        <EplMatchCard />
        <BundesligaMatchCard />
        <LaligaMatchCard />
        <SerieAMatchCard />
        <FranceLeague1MatchCard />
        <OtherMatchCard />
    </div>
  )
}

export default HomePage