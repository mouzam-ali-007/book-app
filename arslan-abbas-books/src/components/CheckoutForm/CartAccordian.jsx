import { useState, useMemo } from "react";
import "./CartAccordian.css";
import { useCart } from "../../context/CartContext";

export default function CartAccordion() {
    const { isBagOpen, toggleBag, removeFromCart, updateQuantity } = useCart();

    const [open, setOpen] = useState(false);

    const cartItems = useMemo(() => {
        const data = localStorage.getItem("cartItems");
        return data ? JSON.parse(data) : [];
    }, []);

    // helpers
    const parsePrice = (price) =>
        Number(price.replace("Rs.", "").replace(",", "").trim());

    const subtotal = cartItems.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );

    const shipping = cartItems.length ? 300 : 0;
    const total = subtotal + shipping;

    return (
        <div className="cart-accordion">
            {/* Header */}
            <div className="cart-header" onClick={() => setOpen(!open)}>
                <div className="cart-header-left">
                    <span className={`arrow ${open ? "open" : ""}`}>⌃</span>
                    <span className="title">Show cart items</span>
                </div>
                <div className="cart-total">Rs. {total.toLocaleString()}</div>
            </div>

            {/* Body */}
            {open && (
                <div className="cart-body">
                    {/* Empty State */}
                    {!cartItems.length && (
                        <div className="empty-cart">
                            No items found in your cart
                        </div>
                    )}

                    {/* Items */}
                    {cartItems.map((item, index) => {
                        const itemTotal = parsePrice(item.price) * item.quantity;

                        return (
                            <div key={index}>
                                <div className="cart-item">
                                    <div className="item-info">
                                        <h4>{item.title}</h4>
                                        <p>
                                            {item.price} × {item.quantity}
                                        </p>
                                    </div>

                                    <div className="item-actions">
                                        {/* <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button> */}

                                        <span className="price">
                                            Rs. {itemTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="divider" />
                            </div>
                        );
                    })}

                    {/* Summary */}
                    {cartItems.length > 0 && (
                        <div className="summary">
                            <div>
                                <span>Subtotal</span>
                                <span>Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            {/* <div>
                                <span>Shipping</span>
                                <span>Rs. {shipping.toLocaleString()}</span>
                            </div> */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
