import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import HowItWorks from '@/components/HowItWorks'
import AboutJay from '@/components/AboutJay'
import FAQ from '@/components/FAQ'
import IntakeForm from '@/components/IntakeForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Portfolio />
      <HowItWorks />
      <AboutJay />
      <FAQ />
      <IntakeForm />
      <Footer />
    </>
  )
}
