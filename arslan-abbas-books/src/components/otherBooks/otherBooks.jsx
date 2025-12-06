import React from "react";
import './otherBooks.css';

const otherBooks = [
    {
        id: 1,
        title: "Dil-e-Khwabzad",
        cover: "./src/assets/Dil-e-Khwabzad.PNG", // replace with actual image path
        tagline: "(Black cover with feet)",
        rating: 4.34,
        reviews: 100,
        description:
            "The Dream–Led Heart. A collection that touches on faith, love, passion, hope, patience, loyalty, journey, and above all, dreaming. This bestselling debut captured the hearts of students across Pakistan."
    },
    {
        id: 2,
        title: "Dard-e-Nayab",
        cover: "./src/assets/Dard-e-Nayaab.PNG", // replace with actual image path
        tagline: "(Maroon cover with silhouette)",
        rating: 4.5,
        reviews: 24,
        description:
            "The Unique Pain. Arslan's second poetry collection delves deeper into the complexities of human emotions, exploring themes of longing, separation, and the bittersweet nature of life’s journey."
    }
];

const OtherBooks = () => {
    return (
        <div className="other-books-section">
            <h2 className="other-books-heading">
                Other books
            </h2>

            <div className="other-books-grid">
                {otherBooks.map((book) => (
                    <div
                        key={book.id}
                        className="other-book-card"
                    >
                        <div className="other-book-image">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="other-book-image__img"
                            />
                        </div>

                        <div className="other-book-content">
                            <h3 className="other-book-title">{book.title}</h3>

                            <div className="other-book-rating">
                                <span className="other-book-rating__stars">★★★★★</span>
                                <p className="other-book-rating__meta">
                                    {book.rating} ({book.reviews} reviews)
                                </p>
                            </div>

                            <p className="other-book-description">
                                {book.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OtherBooks;
