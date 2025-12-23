import React from "react";
import "./orderSuccess.css";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";



const OrderSuccessModal = ({ order, close }) => {
    const navigate = useNavigate();

    const { customer = {}, status, subtotal, shipping, totals, books, method } = order;

    console.log("books", order)


    const onClose = () => {
        close()
        navigate('/store')
    }


    const handleReturnToShare = () => {
        navigate('/store')
    }

    const handleWhatsAppShare = () => {
        const message = `
     Salam! I have placed an order.
      
     Name: ${customer?.fullName || ""}
     Total: Rs ${totals?.grandTotal || ""}
     Payment Method: ${method?.prepayment || "COD"}

      Attached is my payment proof.
      `;

        const phoneNumber = "923221080910";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
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

                {/* <button className="close-btn" onClick={onClose}>×</button> */}

                <div className="order-wrapper">
                    <div className="order-card">

                        {/* Header */}
                        <div className="order-header">


                            <div className="success-header">
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


                                <h1 className="order-title">
                                    Thank You{customer?.fullName ? `, ${customer.fullName}` : ''}!
                                </h1>

                                <p className="order-subtitle">
                                    Your order has been placed successfully.
                                </p>
                            </div>



                        </div>

                        {/* Grid */}
                        <div className="order-grid">
                            {/* Left */}


                            {/* Right */}
                            <aside className="order-summary">

                                <div className="section-card">
                                    <h3 className="card-title">Order Summary</h3>

                                    {books.map((book, index) => (
                                        <div key={index} className="card-row">
                                            <span className="item-name">
                                                {book.title} x{book.quantity}
                                            </span>
                                            <b className="item-price">
                                                {book.price.toLocaleString()}
                                            </b>
                                        </div>
                                    ))}

                                    <div className="divider" />

                                    <div className="card-row total">
                                        <span>Total</span>
                                        <b className="item-price">
                                            {totals?.grandTotal}
                                        </b>
                                    </div>
                                </div>


                                <div className="section-card payment-card">
                                    <h3 className="card-title accent">
                                        Please Transfer your amount to:
                                    </h3>

                                    <p className="payment-method">For Jazzcash/Easypaisa</p>

                                    <div className="payment-row">
                                        <span>Title:</span>
                                        <b>Jahanzaad Books</b>
                                    </div>

                                    <div className="payment-row">
                                        <span>A/c No:</span>
                                        <b>03221080910</b>
                                    </div>
                                </div>


                                <div className="share-row total">

                                    <div className="share-icons">

                                        <button className="whatsapp-btn" onClick={handleWhatsAppShare}>
                                            <FaWhatsapp /> Share Details at WhatsApp
                                        </button>


                                    </div>

                                    <div className="share-icons">

                                        <button className="return-btn" onClick={handleReturnToShare}>
                                            Return to Store
                                        </button>


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
