import React, { useState } from "react";
import "./Subscribe.css";
import { BASE_URL } from "../../utilities/constants";

const SubscribeSection = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubscribe = async () => {
        if (!email) {
            setMessage("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            BASE_URL

            const res = await fetch(`${BASE_URL}/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Subscription failed");
            }

            setMessage("🎉 Successfully subscribed!");
            setEmail("");
        } catch (error) {
            setMessage(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="join-wrapper">
            <div className="join-card">
                <h2>Join 10,000+ Readers</h2>
                <p>
                    Get exclusive poems, launch updates, and philosophical musings
                    delivered directly to your inbox.
                </p>

                <div className="join-form">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSubscribe} disabled={loading}>
                        {loading ? "Subscribing..." : "Subscribe"}
                    </button>
                </div>

                {message && <p className="join-message">{message}</p>}
            </div>
        </section>
    );
};

export default SubscribeSection;
