import React, { useState } from "react";
import "./store.css";
import ViewDetailsModal from "./viewDetails";

const books = [
    {
        id: 1,
        tag: "NEW",
        subTag: "LIMITED",
        title: "Musafirat",
        desc: "Hand-signed & Numbered",
        price: "Rs. 1,500",
        images: [
            "/assets/Musafirat_Hardcover.PNG",
            // Placeholder, replace if unique image exists
        ],
        details: {
            overview: "A journey through the soul. Musafirat brings you the raw essence of travel and longing.",
            tags: ["Poetry", "Hardcover"],
            inBox: ["Signed Hardcover", "Premium Bookmark"],
            save: null
        }
    },
    {
        id: 2,
        tag: "BEST DEAL",
        title: "Complete Works",
        desc: "3 Books + Save Rs400",
        price: "Rs. 3,100",
        images: [
            "/assets/Musafirat_Hardcover.PNG",
            "/assets/Dard-e-Nayaab.PNG",
            "/assets/Dil-e-Khwabzad.PNG"
        ],
        details: {
            overview: "Get Musafirat (signed), Dil-e-Khwabzad, and Dard-e-Nayab in one beautifully curated bundle.",
            tags: ["Hardcover", "Bundle"],
            inBox: ["3 Signed Hardcovers", "Exclusive Bookmark Set"],
            save: "Save Rs.400 instantly!"
        }
    },
    {
        id: 3,
        tag: "BESTSELLER",
        title: "Dil-e-Khwabzad",
        desc: "The heart in passion",
        price: "Rs. 1,000",
        images: [
            "/assets/Dil-e-Khwabzad.PNG",

        ],
        details: {
            overview: "An exploration of dreams and reality, where the heart finds its voice.",
            tags: ["Poetry", "Bestseller"],
            inBox: ["Hardcover Book", "Thematic Bookmark"],
            save: null
        }
    },
    {
        id: 4,
        tag: "IN DEMAND",
        title: "Dard-e-nayab",
        desc: "Pain becomes treasure",
        price: "Rs. 1,000",
        highlight: true,
        images: [
            "/assets/Dard-e-Nayaab.PNG",

        ],
        details: {
            overview: "Finding beauty in pain, Dard-e-nayab is a collection that resonates with the deepest emotions.",
            tags: ["Poetry", "Rare Edition"],
            inBox: ["Hardcover Book", "Collector's Card"],
            save: null
        }
    },
];

const Store = () => {
    const [selectedBook, setSelectedBook] = useState(null);

    return (
        <section className="store">
            <div className="hand-signed">
                <a href="/" className="back-link">← Back to Home</a>

                <h1>All books.</h1>
                <p className="subtitle">Hand-signed. Limited. Yours forever.</p>

            </div>

            <div className="books-grid">
                {books.map((book) => (
                    <div
                        key={book.id}
                        className={`book-card ${book.highlight ? "highlight" : ""}`}
                    >
                        <span className="tag">{book.tag}</span>
                        {book.subTag && <span className="sub-tag">{book.subTag}</span>}

                        <h3>{book.title}</h3>
                        <p className="desc">{book.desc}</p>


                        <img src={book.images[0]} alt={book.title} width="80%" height="60%" />
                        <p className="price">{book.price}</p>
                        <button onClick={() => setSelectedBook(book)} className="details-btn">View Details →</button>
                    </div>
                ))}
            </div>

            {selectedBook && (
                <ViewDetailsModal
                    book={selectedBook}
                    close={() => setSelectedBook(null)}
                />
            )}
        </section>
    );
};

export default Store;
