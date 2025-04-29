import { HeaderMegaMenu } from "./Components/NavBar/Header"
import { SolutionFeatures } from "./Components/SolutionSection/Solution"
import { TechSection } from "./Components/TechSection/TechSection"
import {HeroImageRight} from "./Components/Hero/Hero"
import { Team} from "./Components/TeamSection/Team"
import Footer from "./Components/Footer/Footer"


const Home = () => {
  return (
    <>
      <HeaderMegaMenu />
      <HeroImageRight />
      <SolutionFeatures />
      <Team />
      <TechSection />
      <Footer />
    </>
  )
}

export default Home