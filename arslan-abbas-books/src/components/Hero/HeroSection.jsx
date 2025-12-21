import React, { useEffect, useRef, useState, useCallback } from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

// Helper function for linear interpolation
const lerp = (a, b, t) => a + (b - a) * t;

// Helper function to map scroll progress to a value range and clamp it
const mapAndClamp = (progress, start, end, targetA, targetB) => {
    const segmentProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    return lerp(targetA, targetB, segmentProgress);
};

const HeroSection = () => {
    const navigate = useNavigate();
    const heroContainerRef = useRef(null);
    const morphCardRef = useRef(null);
    const titleLayerRef = useRef(null);
    const ctaLayerRef = useRef(null);
    const pretitleRef = useRef(null);
    const mainTitleRef = useRef(null);
    const [cardActive, setCardActive] = useState(false);
    const [pretitleActive, setPretitleActive] = useState(false);
    const [mainTitleActive, setMainTitleActive] = useState(false);
    const animationFrameIdRef = useRef(null);

    const handlePreOrderClick = () => {
        navigate("/store");
    };

    // Core logic for updating the hero state based on scroll position
    const updateHeroState = useCallback(() => {
        if (!heroContainerRef.current || !morphCardRef.current) return;

        const containerHeight = heroContainerRef.current.offsetHeight;
        const scrollY = window.scrollY;
        const scrollProgress = Math.max(0, Math.min(1, scrollY / (containerHeight - window.innerHeight)));

        // Update CSS custom properties for card morph
        const widthPercent = mapAndClamp(scrollProgress, 0.0, 1.0, 100, 85);
        const heightPercent = mapAndClamp(scrollProgress, 0.0, 1.0, 100, 75);
        const radius = mapAndClamp(scrollProgress, 0.0, 1.0, 0, 32);
        const translateY = mapAndClamp(scrollProgress, 0.0, 1.0, 0, 8);

        document.documentElement.style.setProperty('--card-width-percent', `${widthPercent}%`);
        document.documentElement.style.setProperty('--card-height-percent', `${heightPercent}%`);
        document.documentElement.style.setProperty('--card-radius', `${radius}px`);
        document.documentElement.style.setProperty('--card-translateY', `${translateY}px`);

        // Animate the Text Layers (Fade In/Out)
        if (titleLayerRef.current) {
            const titleOpacity = mapAndClamp(scrollProgress, 0.0, 0.3, 1.0, 0.0);
            const titleTranslateY = mapAndClamp(scrollProgress, 0.0, 0.3, 0, -20);
            titleLayerRef.current.style.opacity = titleOpacity;
            titleLayerRef.current.style.transform = `translateY(${titleTranslateY}px)`;
        }

        if (ctaLayerRef.current) {
            const ctaOpacity = mapAndClamp(scrollProgress, 0.5, 0.8, 0.0, 1.0);
            const ctaTranslateY = mapAndClamp(scrollProgress, 0.5, 0.8, 20, 0);
            ctaLayerRef.current.style.opacity = ctaOpacity;
            ctaLayerRef.current.style.transform = `translateY(${ctaTranslateY}px)`;
        }
    }, []);

    // Throttled scroll handler using requestAnimationFrame
    const onScroll = useCallback(() => {
        if (!animationFrameIdRef.current) {
            animationFrameIdRef.current = requestAnimationFrame(() => {
                updateHeroState();
                animationFrameIdRef.current = null;
            });
        }
    }, [updateHeroState]);

    useEffect(() => {
        // Initial state update
        updateHeroState();

        // Add scroll listener
        window.addEventListener("scroll", onScroll, { passive: true });

        // Hero Landing Transition Logic - Staggered reveal on load
        setTimeout(() => {
            setCardActive(true);
        }, 50);

        setTimeout(() => {
            setPretitleActive(true);
        }, 300);

        setTimeout(() => {
            setMainTitleActive(true);
        }, 450);

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [onScroll, updateHeroState]);

    return (
        <section className="hero-scroll-container" ref={heroContainerRef}>
            {/* Sticky Content Wrapper (100vh tall, holds fixed content) */}
            <div className="pinned-content-wrapper z-20">
                {/* Animated Background Card */}
                <div
                    className={`hero-morph-card z-10 ${cardActive ? 'active' : ''}`}
                    ref={morphCardRef}
                >
                    <div className="hero-overlay"></div>
                </div>

                {/* LAYER 1: Title & Pretitle Layer */}
                <div
                    className="title-layer hero-content-layer z-30 flex items-start pt-20 md-pt-20"
                    ref={titleLayerRef}
                >
                    <div className="text-center w-full vw-padding-main">
                        <p
                            className={`pretitle text-l md-text-xl font-medium text-indigo mb-4 tracking-widest uppercase hero-reveal ${pretitleActive ? 'active' : ''}`}
                            ref={pretitleRef}
                        >
                            NEW RELEASE
                        </p>
                        <h1
                            className={`large-title text-light mb-6 hero-reveal ${mainTitleActive ? 'active' : ''}`}
                            ref={mainTitleRef}
                        >
                            Musafirat
                        </h1>



                    </div>
                </div>

                {/* LAYER 2: CTA Layer (Starts hidden) */}
                <div
                    className="cta-layer hero-content-layer z-40 flex items-end pb-32"
                    ref={ctaLayerRef}
                    style={{ opacity: 0 }}
                >
                    <div className="text-center max-w-5xl mx-auto w-full vw-padding-main">
                        {/* <span className="tag">
                            FIRST READER EDITION – LIMITED 3000 COPIES!
                        </span> */}
                        <p className="text-lg md-text-xl font-light max-w-lg mx-auto mt-60 text-gray-300">
                            A profound exploration of ambition, faith, and the restless human heart.
                        </p>

                        <div className="flex flex-col items-center justify-center  space-y-4">
                            <button
                                onClick={handlePreOrderClick}
                                className="hero-cta-button"
                            >
                                Pre-Order Now
                            </button>
                        </div>

                        <p className="launch mt-1 text-sm text-gray-400">
                            Launching Worldwide: December 27th
                        </p>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
