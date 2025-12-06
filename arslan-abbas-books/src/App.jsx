import { useState } from 'react'

import HeroSection from "./components/Hero/HeroSection.jsx";
import Navbar from './components/navbar/Nav.jsx';
import Testimonials from './components/FeedBack/Feedback.jsx';
import OtherBooks from './components/otherBooks/otherBooks.jsx';
import CheckoutForm from './components/CheckoutForm/checkout.jsx';
import AboutAuthor from './components/AboutAuthor/About.jsx';
import Footer from './components/Footer/footer.jsx';
import Button from './components/Button/Button.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <HeroSection />
      <Testimonials />
      <OtherBooks />
      <CheckoutForm />
      <AboutAuthor />
      <Footer />
      {/* <Button /> */}
    </>

  )
}

export default App
