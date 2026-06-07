import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Partners from './components/Partners/Partners'
import WhoWeAre from './components/WhoWeAre/WhoWeAre'
import Services from './components/Services/Services'
import WhyChoose from './components/WhyChoose/WhyChoose'
import Team from './components/Team/Team'
import Appointment from './components/Appointment/Appointment'
import FAQ from './components/FAQ/FAQ'
import Testimonials from './components/Testimonials/Testimonials'
import BookNow from './components/BookNow/BookNow'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

function HomePage() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <WhyChoose />
      <Partners />
      <Testimonials />
      <BookNow />
    </>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<Team />} />
        <Route path="/booking" element={<Appointment />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
