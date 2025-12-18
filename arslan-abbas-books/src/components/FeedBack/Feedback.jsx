import React, { useState } from "react";
import "./Feedback.css";
import ExcitementModal from "../ExcitementModal/excitement";


const testimonials = [
    {
        icon: "⭐",
        text: "The Voice of Modern Urdu is back. December 27th can't come soon enough.",
        name: "@PoetryHub",
        role: "Literary Influencer",
    },
    {
        icon: "💡",
        text: "A profound exploration of ambition and conviction. Truly a masterpiece.",
        name: "Literature Daily",
        role: "Reviewer",
    },
    {
        icon: "✨",
        text: "Arslan Abbas always delivers depth and style. A mandatory pre-order.",
        name: "Ayesha K.",
        role: "Longtime Reader",
    },
    {
        icon: "📖",
        text: "This feels like the book I needed to read right now. Excited for the themes.",
        name: "TEDx Listener",
        role: "Community Member",
    },
    {
        icon: "📚",
        text: "A seamless blend of philosophy and poetry. Arslan's best work yet.",
        name: "The Bookworm",
        role: "Vlogger",
    },
    {
        icon: "🖊️",
        text: "Every line is a lesson. A must-read for anyone interested in modern Urdu literature.",
        name: "Urdu Times",
        role: "Magazine",
    },
    {
        icon: "🤩",
        text: "Pre-ordered immediately. The cover art alone is stunning, let alone the content.",
        name: "Sara L.",
        role: "Follower",
    },
    {
        icon: "🎤",
        text: "His recitations are hypnotic. Excited to read the source material.",
        name: "Podcast Review",
        role: "Host",
    },
    {
        icon: "🔥",
        text: "The raw emotion is palpable. This book is going to define the year. Don't miss it.",
        name: "Javier M.",
        role: "Literary Critic",
    },
];


const Testimonials = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (<>
        <div className="see-reviews">
            <p className="text"> The Anticipation is Building</p>

            <p className="text"> See the reviews below.</p>

        </div>
        <div className="testimonials-container">


            <div className="slider">
                <div className="slide-track">
                    {testimonials.map((item, index) => (
                        <div className="slide" key={index}>
                            <div className="icon">{item.icon}</div>
                            <p className="text">"{item.text}"</p>
                            <h4 className="name">{item.name}</h4>
                            <span className="role">{item.role}</span>
                        </div>
                    ))}
                </div>
            </div>


        </div>

        {/* Modal */}
        {isModalOpen && <ExcitementModal close={() => setIsModalOpen(false)} />}

        <div className="excitement-comments" onClick={() => setIsModalOpen(true)}>
            <a>Share Your Excitement</a>
        </div>
        {/* <button class="constant-preorder-btn">Secure Your Copy Now</button> */}
    </>




    );
};

export default Testimonials;
