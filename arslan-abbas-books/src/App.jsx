import { useEffect, useRef, useCallback } from 'react'

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
import SubscribeSection from './components/Subscribe/Subsribe.jsx';

const MainPage = () => {
  const animationFrameIdRef = useRef(null);
  // Handle sticky/fixed positioning logic from App level
  const handleScroll = useCallback(() => {
    // Find the hero container and pinned wrapper in the DOM
    const container = document.querySelector('.hero-scroll-container');
    const pinnedWrapper = document.querySelector('.pinned-content-wrapper');

    if (!container || !pinnedWrapper) return;

    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate scroll progress through the container
    // Container starts at containerTop and ends at containerTop + containerHeight
    const scrollProgress = scrollY - containerTop;
    const maxScroll = containerHeight - windowHeight;

    // Within container: use fixed positioning
    // At the end of container: position it at the bottom so it's visible
    // Past container: it will naturally scroll away
    const isWithinContainer = scrollProgress < maxScroll;
    const isAtContainerEnd = scrollProgress >= maxScroll && scrollProgress < containerHeight;

    if (!animationFrameIdRef.current) {
      animationFrameIdRef.current = requestAnimationFrame(() => {
        if (pinnedWrapper) {
          if (isWithinContainer && scrollProgress >= 0) {
            // Within container: use fixed positioning
            pinnedWrapper.style.position = 'fixed';
            pinnedWrapper.style.top = '0';
            pinnedWrapper.style.left = '0';
            pinnedWrapper.style.right = '0';
            pinnedWrapper.style.width = '100%';
            pinnedWrapper.style.zIndex = '20';
          } else if (isAtContainerEnd) {
            // At the end of container: position absolutely at bottom to keep it visible
            pinnedWrapper.style.position = 'absolute';
            pinnedWrapper.style.top = `${maxScroll}px`;
            pinnedWrapper.style.left = '0';
            pinnedWrapper.style.right = '0';
            pinnedWrapper.style.width = '100%';
            pinnedWrapper.style.zIndex = '20';
          } else {
            // Past container: use relative so it scrolls away naturally
            pinnedWrapper.style.position = 'relative';
            pinnedWrapper.style.top = 'auto';
            pinnedWrapper.style.left = '0';
            pinnedWrapper.style.right = '0';
            pinnedWrapper.style.width = '100%';
            pinnedWrapper.style.zIndex = '20';
          }
        }
        animationFrameIdRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <Testimonials />
      <OtherBooks />
      <AuthorSection />
      <SubscribeSection />
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
