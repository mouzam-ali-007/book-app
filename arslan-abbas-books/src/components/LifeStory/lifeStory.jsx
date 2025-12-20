
import React, { useEffect, useState } from "react";
import "./lifeStory.css";

const ComingSoon = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const launchDate = new Date("2026-01-15T00:00:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({
                    days: "00",
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="coming-soon-container">
            <div className="">
                <a href="/" className="back-link">← Back to Home</a>



            </div>

            <h1>Arslan Abass</h1>
            <p>Something amazing is coming soon!</p>
            <div className="countdown">
                <div>
                    <span>{'8'}</span> Days
                </div>
                <div>
                    <span>{timeLeft.hours}</span> Hours
                </div>
                <div>
                    <span>{timeLeft.minutes}</span> Minutes
                </div>
                <div>
                    <span>{timeLeft.seconds}</span> Seconds
                </div>
            </div>

        </div>
    );
};

export default ComingSoon;
