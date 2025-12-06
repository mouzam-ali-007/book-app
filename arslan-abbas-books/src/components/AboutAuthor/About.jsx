import React from "react";
import "./About.css";

export default function AboutAuthor() {
    return (
        <section className="about-section">
            <div className="about-container">

                {/* LEFT SIDE — TEXT */}
                <div className="about-text">
                    <h2 className="about-title">About the author</h2>

                    <p>
                        <strong>Arslan Abbas</strong> is a young Pakistani poet and author,
                        recognized as one of the most resonating contemporary voices in Urdu
                        poetry. His simple yet profound writing style has earned him a
                        dedicated following among youth across South Asia.
                    </p>

                    <p>
                        A graduate in Political Science from the prestigious{" "}
                        <strong>Government College University Lahore (GCU)</strong> — the
                        same institution that nurtured literary giants like Allama Muhammad
                        Iqbal and Faiz Ahmad Faiz — Arslan began writing poetry regularly in
                        2016.
                    </p>

                    <p>
                        His work explores themes of faith, love, passion, hope, dreams, and
                        the human journey. With two bestselling books, Dil-e-Khwabzad and
                        Dard-e-Nayab, Arslan has established himself as a powerful voice for
                        the modern generation.
                    </p>

                    <button className="know-more-btn">Know more</button>
                </div>

                {/* RIGHT SIDE — CARD WITH EMOJI */}
                <div className="about-card">
                    <span className="emoji">✍️</span>
                </div>

            </div>
        </section>
    );
}
