import HeroSection from "../home/HeroSection";
import ClientOnly from "./Clientonly";

  function HeroSectionPage() {
  return (
    <ClientOnly>
      <HeroSection />
    </ClientOnly>
  )
}

export default HeroSectionPage
