import React from "react";
import "./OrderSuccess.css";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";



const OrderSuccessModal = ({ order, close }) => {
    const navigate = useNavigate();

    const { customer = {}, status, subtotal, shipping, totals } = order;

    const handleWhatsAppShare = () => {
        const message = `
      Hey I have place the Order. Below are my Order
      Details. I have paid the amount and i am sharing
      the screenshot with you.
      
      Name: ${customer?.fullName || ""}
      Phone: ${customer?.phone || ""}
      Address: ${customer?.address || ""}
      Notes: ${customer?.notes || ""}
      Status: ${status || ""}
      Shipping: ${shipping?.method || ""}
      Total: Rs ${totals?.grandTotal || ""}
      `;

        const url = `https://wa.me/jahanzaad?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };



    if (!order) {
        navigate("/");;

        return
    }

    // const { fullName, phone, email, address, items } = customer;


    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-box order-modal" onClick={(e) => e.stopPropagation()}>

                <button className="close-btn" onClick={close}>×</button>

                <div className="order-wrapper">
                    <div className="order-card">

                        {/* Header */}
                        <div className="order-header">


                            <div>

                                <div className="title-row">
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

                                    <h1 className="order-title">Thank You for Your Order!</h1>
                                </div>

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
                                    <span>Name</span>
                                    <b>{customer?.fullName}</b>
                                </div>
                                <div className="summary-row">
                                    <span>Contact</span>
                                    <b>{customer?.phone}</b>
                                </div>

                                <div className="summary-row">
                                    <span>SubTotal</span>
                                    <b>{formatCurrency(totals?.subTotal)}</b>
                                </div>

                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <b>{(shipping?.method)}</b>
                                </div>



                                <div className="summary-row ">
                                    <span>Bank Details</span>
                                    <b>{'HBL 09312984971848'}</b>
                                </div>

                                <hr />
                                <div className="summary-row total">
                                    <span>Grand Total</span>
                                    <b>{formatCurrency(totals?.grandTotal)}</b>
                                </div>




                                <div className="share-row total">
                                    <span>Share Details</span>
                                    <div className="share-icons">
                                        <FaWhatsapp
                                            className="whatsapp-icon"
                                            onClick={handleWhatsAppShare}
                                            title="Share on WhatsApp"
                                        />
                                    </div>
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
