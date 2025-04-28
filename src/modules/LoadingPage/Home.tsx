import { HeaderMegaMenu } from "./Components/NavBar/Header"
import { SolutionFeatures } from "./Components/SolutionSection/Solution"
import { TechSection } from "./Components/TechSection/TechSection"
import {HeroImageRight} from "./Components/Hero/Hero"
import { Team} from "./Components/TeamSection/Team"

const Home = () => {
  return (
    <>
      <HeaderMegaMenu />
      <HeroImageRight />
      <SolutionFeatures />
      <Team />
      <TechSection />
    </>
  )
}

export default Home