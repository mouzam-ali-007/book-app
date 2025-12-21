import React, { useEffect, useState } from "react";
import "./AuthorSection.css";
import { useNavigate } from "react-router-dom";

const AuthorSection = () => {
    const navigate = useNavigate()
    const [followers, setFollowers] = useState(0);
    const [views, setViews] = useState(0);

    // Simple animated counter effect
    useEffect(() => {
        const followersTarget = 240; // K+
        const viewsTarget = 10; // M+
        let followersCount = 0;
        let viewsCount = 0;

        const followersInterval = setInterval(() => {
            if (followersCount < followersTarget) {
                followersCount++;
                setFollowers(followersCount);
            } else {
                clearInterval(followersInterval);
            }
        }, 10);

        const viewsInterval = setInterval(() => {
            if (viewsCount < viewsTarget) {
                viewsCount++;
                setViews(viewsCount);
            } else {
                clearInterval(viewsInterval);
            }
        }, 50);

        return () => {
            clearInterval(followersInterval);
            clearInterval(viewsInterval);
        };
    }, []);

    const handleAbout = () => {
        navigate('/about')
    }

    return (
        <section className="author-section">
            <h2 className="author-section-heading">
                The Voice Behind the Words
            </h2>

            <div className="author-section-grid">
                {/* Author Image */}
                <div className="author-image-container">
                    <img
                        id="author-photo"
                        src="/assets/IMG_5151.jpeg"
                        alt="AuthorPortrait"
                        className=""
                    />
                    {/* RIGHT SIDE — CARD WITH EMOJI */}

                </div>

                {/* Bio Snippet & CTAs */}
                <div className="author-content">
                    <p className="author-bio">
                        From a promising career in <strong>Chartered Accountancy</strong> to the Voice of Modern Urdu,
                        Arslan Abbas's journey is one of conviction. He distills complex human emotion into elegant,
                        powerful prose, resulting in the <strong>"minimalist execution of maximum feeling."</strong>
                    </p>

                    {/* Digital Metrics / Stats Cards */}


                    <div>
                        <p className="author-stats-label">Global Reach</p>

                        <div className="author-stats-grid">
                            {/* Followers + Views card */}
                            <div className="author-stat-card">
                                <div className="stat-item">
                                    <p className="author-stat-value">{followers}K+</p>
                                    <p className="author-stat-label">Followers</p>
                                </div>

                                <div className="stat-item">
                                    <p className="author-stat-value">{views}M+</p>
                                    <p className="author-stat-label">Views (Monthly)</p>
                                </div>
                            </div>

                            {/* TEDx */}
                            <div className="author-stat-card full-width">
                                <p className="author-stat-value tedx">TEDx</p>
                                <p className="author-stat-label tedx">Keynote Speaker</p>
                            </div>
                        </div>
                    </div>
                    {/* CTA Button */}
                    <a

                        className="author-cta-button"
                        onClick={handleAbout}
                    >
                        Read The Full Story
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AuthorSection;
