import React from "react";
import "./Feedback.css";

const testimonials = [
    {
        stars: "★★★★★",
        text: `"Dil-e-Khwabzad changed my perspective on life. Arslan’s words have the power to heal and inspire. A must-read for every Urdu poetry lover."`,
        author: "Muhammad Ali",
    },
    {
        stars: "★★★★☆",
        text: `"Beautiful collection of poetry that speaks to the heart. Arslan Abbas is one of the most promising contemporary Urdu poets."`,
        author: "Fatima R.",
    },
    {
        stars: "★★★★★",
        text: `"His poetry is like a conversation with your own soul. Every word feels personal and deeply moving. Highly recommended!"`,
        author: "Hassan M.",
    },
    {
        stars: "★★★★★",
        text: `"Arslan Abbas writes with such authenticity and passion. His work captures the essence of youth, dreams, and love beautifully."`,
        author: "Zainab S.",
    },
];

const Testimonials = () => {
    return (
        <section className="testimonials-section">
            <h2 className="testimonials-title">What readers are saying</h2>


            <div className="slider">
                <div className="slide-track">
                    {testimonials.concat(testimonials).map((t, index) => (
                        <div className="slide" key={index}>
                            <p className="stars">{t.stars}</p>
                            <p className="text">{t.text}</p>
                            <p className="author">— {t.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
