
import React from "react";
import "./Bag.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Bag = () => {
    const { isBagOpen, toggleBag, cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        toggleBag();
        navigate("/checkout");
    };

    if (!isBagOpen) return null;

    return (
        <div className="bag-overlay" onClick={toggleBag}>
            <div className="bag-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="bag-header">
                    <h2>Your Bag</h2>
                    <button className="close-bag" onClick={toggleBag}>✕</button>
                </div>

                <div className="bag-items">
                    {cartItems.length === 0 ? (
                        <p className="empty-msg">Your bag is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="bag-item">
                                <div className="item-info">
                                    <h3>{item.title}</h3>
                                    <p className="item-price">{item.price} <span className="item-multiply">× {item.quantity}</span></p>
                                </div>
                                <div className="item-actions">
                                    <div className="qty-controls">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="delete-btn" style={{ marginLeft: "5px" }} onClick={() => removeFromCart(item.title)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bag-footer">
                    <div className="total-row">
                        <span>Total</span>
                        <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout} disabled={cartItems.length === 0}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Bag;
