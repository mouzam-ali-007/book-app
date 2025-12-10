import { useState } from 'react'

import HeroSection from "./components/Hero/HeroSection.jsx";
import Navbar from './components/navbar/Nav.jsx';
import Testimonials from './components/FeedBack/Feedback.jsx';
import OtherBooks from './components/otherBooks/otherBooks.jsx';
import CheckoutForm from './components/CheckoutForm/checkout.jsx';
import AboutAuthor from './components/AboutAuthor/About.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from './components/Footer/footer.jsx';
import Button from './components/Button/Button.jsx';

const MainPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Testimonials />
      <OtherBooks />
      <AboutAuthor />
      <Footer />
    </>
  )
}

function App() {
  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/checkout" element={<CheckoutForm />} />
        </Routes>
      </Router>




      {/* <Button /> */}
    </>

  )
}

export default App
