import React, { useState } from "react";
import "./Checkout.css";

const booksList = [
    {
        id: 1,
        title: "Musafirat (First Edition )",
        price: 800,
        edition: "Limited Edition",
        cover: "/covers/musafirat.png",
        background: "linear-gradient(135deg, #192a56 0%, #0c1a36 100%)"
    },
    {
        id: 2,
        title: "Dil-e-Khwabzad (Black)",
        price: 750,
        edition: "Available",
        cover: "/covers/dilekhwabzad.png",
        background: "linear-gradient(135deg, #000 0%, #222 100%)",
        border: "1px solid #333"
    },
    {
        id: 3,
        title: "Dard-e-Nayab (Maroon)",
        price: 700,
        edition: "Available",
        cover: "/covers/dardnayab.png",
        background: "linear-gradient(135deg, #8b0000 0%, #5a0000 100%)"
    },
];


export default function CheckoutForm() {
    const [quantities, setQuantities] = useState({
        1: 1,
        2: 0,
        3: 0,
    });

    const subtotal = booksList.reduce(
        (sum, book) => sum + quantities[book.id] * book.price,
        0
    );

    const shipping = subtotal > 0 ? 250 : 0;
    const grandTotal = subtotal + shipping;

    const updateQty = (id, value) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value < 0 ? 0 : value,
        }));
    };

    return (
        <div className="checkout-wrapper">
            <h1 className="main-title">1. Pre-Order & Shipping Details</h1>
            <p className="subtitle">
                Select the books and quantities you wish to pre-order (Prices are in PKR).
            </p>

            <div className="books-row">
                {booksList.map((book) => (
                    <div key={book.id} className="book-card">
                        <div className="book-details"
                            style={{
                                background: book.background,
                                border: book.border || "none",
                            }}
                        >



                            <h3 className="book-title">{book.title}</h3>
                        </div>
                        <div className="book-attributes">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-price">PKR {book.price}</p>
                            <p className="book-edition">{book.edition}</p>
                        </div>



                        <div className="qty-box">
                            <input
                                type="number"
                                min="0"
                                value={quantities[book.id]}
                                onChange={(e) => updateQty(book.id, Number(e.target.value))}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="summary-box">
                <div className="summary-row">
                    <span>Subtotal:</span>
                    <strong>PKR {subtotal}</strong>
                </div>
                <div className="summary-row">
                    <span>Shipping (Flat Rate):</span>
                    <strong>PKR {shipping}</strong>
                </div>
                <div className="summary-row total">
                    <span>Grand Total:</span>
                    <strong>PKR {grandTotal}</strong>
                </div>
            </div>

            <h2 className="contact-title">Contact & Address</h2>

            <div className="form-group">
                <label>Full Name</label>
                <input placeholder="Arsalan Demo User" />
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input placeholder="+92 321 1234567" />
            </div>

            <div className="form-group">
                <label>Full Shipping Address</label>
                <input placeholder="123 Gulberg III, Main Boulevard" />
            </div>

            <div className="form-group">
                <label>City / Town</label>
                <input placeholder="Lahore" />
            </div>

            <div className="edition-box">
                <p className="edition-heading">FIRST READER EDITION</p>
                <p className="edition-limit">Limited to 3,000 copies only</p>
                <p className="edition-alert">
                    HURRY! Only <span>50 copies</span> remaining globally.
                </p>
            </div>

            <button className="payment-btn">
                Proceed to Payment (PKR {grandTotal})
            </button>
        </div>
    );
}
