import { useState } from 'react'

import HeroSection from "./components/Hero/HeroSection.jsx";
import Navbar from './components/navbar/Nav.jsx';
import Testimonials from './components/FeedBack/Feedback.jsx';
import OtherBooks from './components/otherBooks/otherBooks.jsx';
import CheckoutForm from './components/CheckoutForm/Checkout.jsx';

import AboutAuthor from './components/AboutAuthor/About.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from './components/Footer/Footer.jsx';
import Button from './components/Button/Button.jsx';
import OrderSuccess from './components/OrderSuccess/orderSuccess.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthorSection from './components/AboutAuthor/AuthorSection.jsx';
import Store from './components/Store/store.jsx';
import ComingSoon from './components/LifeStory/lifeStory.jsx';
import { CartProvider } from './context/CartContext';
import Bag from './components/Bag/Bag';

const MainPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Testimonials />
      <OtherBooks />
      <AuthorSection />
      <Footer />
    </>
  )
}

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/order" element={<OrderSuccess />} />
            <Route path="/store" element={<Store />} />
            <Route path="/about" element={<ComingSoon />} />
          </Routes>
          <Bag />
        </Router>
      </CartProvider>




      {/* <Button /> */}
    </>

  )
}

export default App
