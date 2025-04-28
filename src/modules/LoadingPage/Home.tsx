import { HeaderMegaMenu } from "./Components/NavBar/Header"
import { SolutionFeatures } from "./Components/SolutionSection/Solution"
import { TechSection } from "./Components/TechSection/TechSection"
import {HeroImageRight} from "./Components/Hero/Hero"

const Home = () => {
  return (
    <>
      <HeaderMegaMenu />
      <HeroImageRight />
      <SolutionFeatures />
      <TechSection />
    </>
  )
}

export default Home