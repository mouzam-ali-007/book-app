import { useState } from 'react'

import HeroSection from "./components/Hero/HeroSection.jsx";
import Navbar from './components/navbar/Nav.jsx';
import Testimonials from './components/FeedBack/Feedback.jsx';
import OtherBooks from './components/otherBooks/otherBooks.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <HeroSection />
      <Testimonials />
      <OtherBooks />
    </>

  )
}

export default App
