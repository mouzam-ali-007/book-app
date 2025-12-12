// OrderSuccess.jsx
import React from "react";
import "./OrderSuccess.css";

import { ToastContainer, toast } from 'react-toastify';

export default function OrderSuccess({ props }) {

    let order = {
        fullName: "Shebaz Sharif",
        phone: "03001234567",
        email: "thearslanabbas@gmail.com",
        address: "Model Town, Lahore",
        items: [],
        status: "In Progress",
        subtotal: 800,
        shipping: 250,
        grandTotal: 1050,
    }
    const {
        fullName,
        phone,
        email,
        address,
        items,
        status,
        subtotal,
        shipping,
        grandTotal,
    } = order;

    return (
        <div className="order-wrapper">

            <div className="order-card">
                {/* Header */}
                <div className="order-header">
                    <div className="checkmark-circle">
                        <svg className="checkmark-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="order-title">Thank You for Your Order!</h1>
                        <p className="order-subtitle">We've received your order and will process it shortly.</p>
                    </div>

                    <span className="status-pill">{status}</span>
                </div>


                {/* Grid */}
                <div className="order-grid">
                    {/* Left */}
                    <div className="order-left">
                        <h2 className="section-title">Customer Information</h2>
                        <div className="info-box">
                            <div className="info-row"><span>Full Name:</span> {fullName}</div>
                            <div className="info-row"><span>Phone:</span> {phone}</div>
                            <div className="info-row"><span>Email:</span> {email}</div>
                            <div className="info-row"><span>Address:</span> {address}</div>
                        </div>

                        <h3 className="section-title mt">Your Items</h3>
                        <div className="items-box">
                            {items && items.length > 0 ? (
                                items.map((it, idx) => (
                                    <div key={idx} className="item-row">
                                        <div>
                                            <div className="item-title">{it.title}</div>
                                            <div className="item-tag">{it.tagline}</div>
                                        </div>
                                        <div className="item-price">{formatCurrency(it.price)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-items">No items found.</div>
                            )}
                        </div>
                    </div>

                    {/* Right Summary */}
                    <aside className="order-summary">
                        <h4 className="summary-title">Order Summary</h4>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <b>{formatCurrency(subtotal)}</b>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <b>{formatCurrency(shipping)}</b>
                        </div>

                        <hr />

                        <div className="summary-row total">
                            <span>Grand Total</span>
                            <b>{formatCurrency(grandTotal)}</b>
                        </div>

                        {/* <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(JSON.stringify(order))}>Copy Order Data</button>
                        <button className="print-btn" onClick={() => window.print()}>Print Receipt</button> */}
                    </aside>
                </div>

                {/* Footer */}
                <div className="order-footer">
                    <span>Best Regards, Arslan Abbas</span>
                    <span>Thank you for chosing  us!</span>
                </div>
            </div>
        </div>
    );
}

function formatCurrency(value) {
    return `Rs${value}`;
}
