import React from "react";
import "./OrderSuccess.css";

const OrderSuccessModal = ({ order, close }) => {

    const { customer, status, subtotal, shipping, totals } = order


    const {
        fullName,
        phone,
        email,
        address,
        items,


    } = customer;

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-box order-modal" onClick={(e) => e.stopPropagation()}>

                <button className="close-btn" onClick={close}>×</button>

                <div className="order-wrapper">
                    <div className="order-card">

                        {/* Header */}
                        <div className="order-header">
                            <div className="checkmark-circle">
                                <svg
                                    className="checkmark-icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h1 className="order-title">Thank You for Your Order!</h1>
                                <p className="order-subtitle">
                                    We've received your order and will process it shortly.
                                </p>
                            </div>

                            <span className="status-pill">{status}</span>
                        </div>

                        {/* Grid */}
                        <div className="order-grid">
                            {/* Left */}


                            {/* Right */}
                            <aside className="order-summary">
                                <h4 className="summary-title">Order Summary</h4>

                                <div className="summary-row">
                                    <span>SubTotal</span>
                                    <b>{formatCurrency(totals?.subTotal)}</b>
                                </div>

                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <b>{(shipping?.method)}</b>
                                </div>

                                <hr />

                                <div className="summary-row total">
                                    <span>Grand Total</span>
                                    <b>{formatCurrency(totals?.grandTotal)}</b>
                                </div>
                            </aside>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;

const formatCurrency = (value) => `Rs ${value}`;
