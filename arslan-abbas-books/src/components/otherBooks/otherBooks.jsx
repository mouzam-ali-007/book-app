import React from "react";
import { useNavigate } from "react-router-dom";
import "./otherBooks.css";


const data = [
    {
        id: 1,
        title: "Dil-e-Khwabzad",
        cover: "/assets/Dil-e-Khwabzad.PNG",
        tagline: "The Dream–Led Heart",
        rating: 4.34,
        reviews: 100,
        description:
            "A collection that touches on faith, love, passion, hope, patience, loyalty, journey, and above all, dreaming. This bestselling debut captured the hearts of students across Pakistan."
    },
    {
        id: 2,
        title: "Dard-e-Nayab",
        cover: "/assets/Dard-e-Nayaab.PNG",
        tagline: "The Unique Pain",
        rating: 4.5,
        reviews: 24,
        description:
            "Arslan's second poetry collection delves deeper into the complexities of human emotions, exploring themes of longing, separation, and the bittersweet nature of life’s journey."
    }
];

const otherBooks = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/store");
    }



    return (
        <>
            <div className="explore-canon">  Explore the Canon</div>
            <div className="books-grid">

                {data.map((book) => (
                    <div className="book-card-container" key={book.id}>
                        <div className="book-inner">
                            {/* Cover */}
                            <div className="other-books">
                                <img src={book.cover} alt={book.title} />
                            </div>

                            {/* Content */}
                            <div className="book-content">
                                <h2 className="book-title">{book.title}</h2>
                                <h4 className="book-subtitle">{book.tagline}</h4>

                                <p className="book-description">{book.description}</p>

                                <div className="book-rating">
                                    <span className="stars">
                                        {"★".repeat(Math.round(book.rating))}
                                    </span>
                                    <span className="rating-text">
                                        ({book.rating}/5 from {book.reviews}+ readers)
                                    </span>
                                </div>

                                <div className="book-actions">
                                    <button className="btn-outline">See Details</button>
                                    <button className="btn-primary" onClick={handleClick}>Buy Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default otherBooks;
