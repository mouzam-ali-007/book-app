import React, { useState, useEffect } from "react";
import "./Feedback.css";
import ExcitementModal from "../ExcitementModal/excitement";
import { BASE_URL } from "../../utilities/constants";

const existingData = [
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

];

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            const url = `${BASE_URL}api/getAllReviews`
            try {
                const res = await fetch(url);
                const data = await res.json();

                if (res.ok) {
                    // Filter only approved reviews
                    const approvedReviews = data.data.filter(item => !item.approvedByAdmin);
                    setTestimonials(approvedReviews, ...existingData);
                } else {
                    console.error("Failed to fetch reviews:", data.message);
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setTestimonials(existingData)
            }
        };

        fetchReviews();
    }, []);

    return (
        <>
            <div className="see-reviews">
                <p className="text">The Anticipation is Building</p>
                <p className="text">See the reviews below.</p>
            </div>

            <div className="testimonials-container">
                <div className="slider">
                    <div className="slide-track">
                        {testimonials.length ? (
                            testimonials.map((item) => (
                                <div className="slide" key={item._id}>
                                    <div className="icon">{item.icons}</div>
                                    <p className="text">"{item.description}"</p>
                                    <h4 className="name">{item.name}</h4>
                                    <span className="role">{item.role}</span>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && <ExcitementModal close={() => setIsModalOpen(false)} />}

            <div className="excitement-comments" onClick={() => setIsModalOpen(true)}>
                <a>Share Your Excitement</a>
            </div>
        </>
    );
};

export default Testimonials;
