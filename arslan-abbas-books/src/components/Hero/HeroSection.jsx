import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
    return (
        <div className="hero-container">
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

                <button className="preorder-btn">Pre-Order Musafirat Now</button>
            </div>

            {/* RIGHT CONTENT */}
            <div className="hero-right">
                <div className="book-card">
                    <p className="placeholder">📘 Musafirat Book Cover
                        <br /> (Navy cover with two people walking)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
