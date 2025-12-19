import React, { useState, useEffect } from "react";
import "./viewDetails.css";

const ViewDetailsModal = ({ book, close, onNext, onPrev }) => {
    const [index, setIndex] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const [rotateY, setRotateY] = useState(-25); // Default perspective angle

    // Reset image index and rotation when book changes
    useEffect(() => {
        setIndex(0);
        setRotateY(-25);
    }, [book]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onNext, onPrev, close]);

    if (!book) return null;

    const nextImage = () => setIndex((index + 1) % book.images.length);
    const prevImage = () => setIndex((index - 1 + book.images.length) % book.images.length);

    const handleMouseMove = (e) => {
        if (!isRotating) return;
        const width = e.currentTarget.offsetWidth;
        const x = e.nativeEvent.offsetX;
        const rotation = ((x / width) * 360) - 180; // Map cursor position to -180 to 180 degrees
        setRotateY(rotation);
    };

    return (
        <div className="details-overlay" onClick={close}>
            <div className="details-modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header-actions">
                    <button className="nav-book prev-book" onClick={onPrev}>← Prev Book</button>
                    <button className="close-btn" onClick={close}>✕</button>
                    <button className="nav-book next-book" onClick={onNext}>Next Book →</button>
                </div>

                {/* CARD 1 — IMAGE SLIDER / 3D VIEW */}
                <div className="card slider-card">
                    <div className="view-toggle">
                        <button
                            className={!isRotating ? "active" : ""}
                            onClick={() => setIsRotating(false)}
                        >
                            Gallery
                        </button>
                        <button
                            className={isRotating ? "active" : ""}
                            onClick={() => setIsRotating(true)}
                        >
                            3D View
                        </button>
                    </div>

                    {!isRotating ? (
                        <>
                            <div className="slider">
                                <img src={book.images[index]} alt={book.title} />
                                <button className="nav left" onClick={prevImage}>‹</button>
                                <button className="nav right" onClick={nextImage}>›</button>
                            </div>
                            <div className="dots">
                                {book.images.map((_, i) => (
                                    <span
                                        key={i}
                                        className={i === index ? "dot active" : "dot"}
                                        onClick={() => setIndex(i)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div
                            className="book-3d-wrapper"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setRotateY(-25)} // Reset on leave
                        >
                            <div
                                className="book-3d"
                                style={{ transform: `rotateY(${rotateY}deg)` }}
                            >
                                <div className="book-face front">
                                    <img src={book.images[0]} alt="Front Cover" />
                                </div>
                                <div className="book-face spine"></div>
                                <div className="book-face back"></div>
                            </div>
                            <p className="rotate-instruction">Move cursor to rotate</p>
                        </div>
                    )}
                </div>

                {/* CARD 2 — PRODUCT INFO */}
                <div className="card">
                    <h2>{book.title}</h2>
                    <p className="sub">{book.subtitle || book.tag}</p>
                    <p className="price">{book.price}</p>

                    <div className="order-row">
                        <button className="qty">−</button>
                        <button className="order-btn">Order Now</button>
                        <button className="qty">+</button>
                    </div>

                    <p className="limit">Max {book.max} per person</p>
                </div>

                {/* CARD 3 — OVERVIEW */}
                <div className="card">
                    <h3>Overview</h3>
                    <div className="tags">
                        {/* Tags not in new schema, removing or keeping if derived */}
                        {book.tag && <span className="tag-pill">{book.tag}</span>}
                    </div>
                    <p>{book.overview}</p>
                </div>

                {/* CARD 4 — WHAT’S IN THE BOX */}
                <div className="card">
                    <h3>What’s in the box</h3>
                    <ul>
                        {book.box && book.box.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    {book.ships && <p className="save">{book.ships}</p>}
                </div>
            </div>
        </div>
    );
};

export default ViewDetailsModal;
