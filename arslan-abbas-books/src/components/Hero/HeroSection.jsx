import React, { useEffect, useState } from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Nav";
import HeroAnimatedText from "./Animation";

const HeroSection = () => {
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);
    let lastScrollY = 0;

    const handlePreOrderClick = () => {
        navigate("/store");
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // scroll down → show
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowButton(true);
            }

            // scroll up → hide
            if (currentScrollY < lastScrollY) {
                setShowButton(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="hero-container">

            {/* <HeroAnimatedText /> */}

            {/* LEFT CONTENT */}
            <div className="hero-left">
                <p className="new-release">NEW RELEASE</p>
                <h1 className="hero-title">Musafirat</h1>

                <span className="tag">
                    FIRST READER EDITION – LIMITED 3000 COPIES!
                </span>

                <p className="description">
                    A story of every young heart. Experience a poetic journey that explores
                    the depths of dreams, love, and the human spirit through the eyes of
                    Pakistan's most resonating contemporary voice.
                    <strong> Don’t miss out on this exclusive First Reader Edition.</strong>
                </p>
            </div>

            {/* CENTER CTA (SCROLL BASED) */}
            <button
                className={`preorder-btn scroll-cta ${showButton ? "show" : ""}`}
                onClick={handlePreOrderClick}
            >
                Pre-Order Now
            </button>

            {/* RIGHT CONTENT */}
            <div className="hero-right">
                <div className="book-card-img">
                    <img src="/assets/Musafirat_Hardcover.PNG" width="90%" />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
