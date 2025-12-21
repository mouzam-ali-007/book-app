import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Navbar from "../navbar/Nav";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderSuccessModal from "../OrderSuccess/orderSuccess";
import { BASE_URL, DISCOUNT_PROMOS } from "../../utilities/constants";
import CartAccordion from "./CartAccordian";
import {
    FiTruck,
    FiCreditCard,
    FiSmartphone,
    FiHome
} from "react-icons/fi";


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
        title: "Dil-e-Khwabzad",
        price: 750,
        edition: "Available",
        cover: "/covers/dilekhwabzad.png",
        background: "linear-gradient(135deg, #000 0%, #222 100%)",
        border: "1px solid #333"
    },
    {
        id: 3,
        title: "Dard-e-Nayab",
        price: 700,
        edition: "Available",
        cover: "/covers/dardnayab.png",
        background: "linear-gradient(135deg, #8b0000 0%, #5a0000 100%)"
    },
];


export default function CheckoutForm() {
    const navigate = useNavigate();


    const [orderData, setOrderData] = useState(false);

    const [shippingMethod, setShippingMethod] = useState("standard");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subTotal, setSubTotal] = useState(false);

    const [edition, setEdition] = useState("simple");
    const [name, setName] = useState("");
    const [line, setLine] = useState("");

    const [open, setOpen] = useState(false);

    const [promoCode, setPromoCode] = useState(false);
    const [code, setCode] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const [method, setMethod] = useState("prepaid");
    const [gateway, setGateway] = useState("card");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        secondary: "",
        address: "",
        nearAddress: '',
        city: "",
        postalCode: "",
        notes: "",
    });



    const [quantities, setQuantities] = useState({
        1: 0,
        2: 0,
        3: 0,
    });


    const getSubTotalfromCart = () => {
        const addedData = localStorage.getItem("cartItems");
        const parsedData = addedData ? JSON.parse(addedData) : [];

        const price = parsedData.reduce((acc, item) => {
            // Convert price string like "Rs. 1,500" to number 1500
            const priceNumber = typeof item.price === "string"
                ? parseInt(item.price.replace(/[^0-9]/g, ""), 10)
                : item.price;

            return acc + priceNumber * (item.quantity || 1);
        }, 0);

        setSubTotal(price)

        return price;
    };

    useEffect(() => {
        getSubTotalfromCart();

    }, [])






    const updateQty = (id, value) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value < 0 ? 0 : value,
        }));
    };


    const handleBack = () => {

        navigate("/store");
    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const applyCode = () => {
        const enteredCode = code.trim().toUpperCase();

        if (DISCOUNT_PROMOS[enteredCode]) {
            setError("");
            setSuccess(`✅ Promo code applied successfully`);
            setPromoCode(true)

            // apply discount logic here
        } else {
            setSuccess("")
            setError("❌  Invalid propm code");
            setPromoCode(false)
        }
    };
    const shipping = shippingMethod === "express"
        ? 800
        : 300;

    const DISCOUNT_PERCENT = 10;
    const isPromoCodeDiscount = promoCode
        ? subTotal - (subTotal * DISCOUNT_PERCENT) / 100
        : subTotal;


    const finalAmount = method === 'prepaid' ? isPromoCodeDiscount - 300 : isPromoCodeDiscount

    const grandTotal = finalAmount + shipping;


    const handleSubmit = async (e) => {
        e.preventDefault();





        if (!formData.fullName || !formData.phone || !formData.city) {
            toast.error("Please fill required fields");
            return;
        }

        // selected items only
        const items = booksList
            .filter(book => quantities[book.id] > 0)
            .map(book => ({
                bookId: book.id,
                title: book.title,
                price: book.price,
                quantity: quantities[book.id],
                total: book.price * quantities[book.id],
            }));



        const addedData = localStorage.getItem("cartItems");
        const parsedData = addedData ? JSON.parse(addedData) : [];


        if (parsedData.length === 0) {
            toast.error("Please select at least one book");
            return;
        }
        const orderRequest = {
            customer: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                notes: formData.notes,
            },
            books: parsedData,
            shipping: {
                method: shippingMethod,
                cost: shipping,
            },

            totals: {
                subTotal: isPromoCodeDiscount,
                shipping,
                grandTotal,
            },
            status: "Pending",

            ...(edition === "simple" && { edition: 'simple' }),
            ...(edition === "signed" && { edition: "signed", signed: { name, line } }),

            ...(method === "cod" && { method }),
            ...(method !== "cod" && { method: { prepayment: gateway } }),

            ...(promoCode && { code: promoCode }),


        };


        setOrderData(orderRequest)
        setIsSubmitting(true);

        const url = `${BASE_URL}api/order`

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderRequest),
            });


            localStorage.setItem("checkoutOrder", JSON.stringify(orderRequest));
            setIsSubmitting(false);
            setIsModalOpen(true)
            setTimeout(() => {
                navigate('/')
            }, 5000)
            localStorage.removeItem('cartItems')

        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
            setIsSubmitting(false);
            localStorage.removeItem('cartItems')
        }



    };




    return (
        <>
            <Navbar />
            <div className="checkout-margin">
            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                pauseOnHover
                closeOnClick

                toastClassName="small-toast"
                bodyClassName="small-toast-body"

                style={{ marginTop: "10px" }}
                toastStyle={{
                    transition: "all 0.6s ease"
                }}

            />



            <div className="checkout-wrapper">

                <div className="back-store">
                    <a onClick={handleBack} className="back-link">← Back to Store</a>

                    <CartAccordion />
                    <h1 className="main-title">Checkout</h1>
                    <p className="subtitle">
                        Final Step to secure your signed copies
                    </p>

                </div>






                {/* <div className="books-row">
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
                </div> */}

                {/* SHIPPING INFORMATION */}
                <div className="shipping-card">
                    <h2 className="section-title">Shipping Information</h2>

                    <div className="input-row">
                        <input

                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"

                        />
                    </div>

                    <div className="input-row two-col">



                        <input type="text"
                            name="phone"
                            value={formData.phone}
                            placeholder="Phone Number"

                            onChange={handleChange}


                        />
                        <input type="text"
                            name="secondary"
                            value={formData.secondary}
                            placeholder="Secondary Contact"

                            onChange={handleChange}

                        />
                    </div>

                    <div className="input-row">
                        <input type="email"

                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                        />
                    </div>

                    <div className="input-row">
                        <input type="text"
                            name="address"
                            placeholder="Shipping Address"
                            value={formData.address}
                            onChange={handleChange}

                        />
                    </div>

                    <div className="input-row">
                        <input type="text"
                            name="nearAddress"
                            placeholder="Nearest Famous Point"
                            value={formData.nearAddress}
                            onChange={handleChange}

                        />
                    </div>
                    <div className="input-row two-col">
                        <input type="text" placeholder="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}

                        />
                        <input type="text" placeholder="Postal Code"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}

                        />
                    </div>

                    <div className="input-row">
                        <textarea

                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Order Notes (Optional)"
                        />
                    </div>
                </div>

                {/* SHIPPING METHOD */}
                <div className="shipping-card">
                    <h2 className="section-title">Shipping Method</h2>

                    <label className="shipping-option">
                        <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={() => setShippingMethod("standard")}
                        />
                        <div>
                            <p className="method-title">Standard (7–10 days)</p>
                            <span className="method-price">Rs. 300</span>
                        </div>
                    </label>

                    <label className="shipping-option">
                        <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={() => setShippingMethod("express")}
                        />
                        <div>
                            <p className="method-title">Express (2–3 days)</p>
                            <span className="method-price">Rs. 800</span>
                        </div>
                    </label>
                </div>

                <div className="edition-card">
                    <h3>Edition Preference</h3>
                    <div className="divider" />

                    {/* Simple Copy */}
                    <label className={`option ${edition === "simple" ? "active" : ""}`}>
                        <input
                            type="radio"
                            name="edition"
                            value="simple"
                            checked={edition === "simple"}
                            onChange={() => setEdition("simple")}
                        />
                        <span>Simple Copy</span>
                    </label>

                    {/* Signed Copy */}
                    <label className={`option ${edition === "signed" ? "active" : ""}`}>
                        <input
                            type="radio"
                            name="edition"
                            value="signed"
                            checked={edition === "signed"}
                            onChange={() => setEdition("signed")}
                        />
                        <div>
                            <span>Signed Copy</span>
                            <small>Note: Requires Pre-payment</small>
                        </div>
                    </label>

                    {/* Extra fields */}
                    {edition === "signed" && (
                        <div className="signed-fields">
                            <div className="field">
                                <label>Name for signature</label>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label>Choose a line</label>
                                <select value={line} onChange={(e) => setLine(e.target.value)}>
                                    <option value="">Select a couplet...</option>
                                    <option value="line1">Couplet 1</option>
                                    <option value="line2">Couplet 2</option>
                                    <option value="line3">Couplet 3</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="payment-card">
                    <h3>Payment</h3>
                    <div className="divider" />

                    {/* Cash on Delivery */}
                    <label className={`pay-option ${method === "cod" ? "active" : ""}`}>
                        <input
                            type="radio"
                            name="method"
                            checked={method === "cod"}
                            onChange={() => setMethod("cod")}
                        />
                        <div className="pay-content disabled">
                            <div className="icon">
                                <FiTruck />
                            </div>
                            <div>
                                <h4>Cash on Delivery</h4>
                                <p>Ships on 1st January 2026</p>
                            </div>
                        </div>
                    </label>

                    {/* Pre-payment */}
                    <label className={`pay-option ${method === "prepaid" ? "active" : ""}`}>
                        <input
                            type="radio"
                            name="method"
                            checked={method === "prepaid"}
                            onChange={() => setMethod("prepaid")}
                        />
                        <div className="pay-content">
                            <div className="icon">
                                <FiCreditCard />
                            </div>
                            <div>
                                <h4>Pre-payment</h4>
                                <p className="green">Ships Tomorrow + Saves Rs.300</p>
                            </div>
                        </div>
                    </label>

                    {/* Gateways */}
                    {method === "prepaid" && (
                        <div className="gateway-section">
                            <span className="gateway-title">Select Payment Gateway:</span>

                            <label className="gateway">
                                <input
                                    type="radio"
                                    name="gateway"
                                    checked={gateway === "bank"}
                                    onChange={() => setGateway("bank")}
                                />
                                <FiHome />
                                <span>Bank Transfer</span>
                            </label>

                            <label className="gateway">
                                <input
                                    type="radio"
                                    name="gateway"
                                    checked={gateway === "wallet"}
                                    onChange={() => setGateway("wallet")}
                                />
                                <FiSmartphone />
                                <span>Jazzcash / Easypaisa</span>
                            </label>

                            <label className="gateway">
                                <input
                                    type="radio"
                                    name="gateway"
                                    checked={gateway === "card"}
                                    onChange={() => setGateway("card")}
                                />
                                <FiCreditCard />
                                <span>Debit / Credit Card</span>
                            </label>

                            {/* <label className="gateway">
                                <input
                                    type="radio"
                                    name="gateway"
                                    checked={gateway === "paypal"}
                                    onChange={() => setGateway("paypal")}
                                />
                                <FiCreditCard />
                                <span disabled> PayPal</span>
                            </label> */}
                        </div>
                    )}
                </div>

                {/* ORDER SUMMARY */}
                <div className="checkout-card">
                    <h2 className="section-title">Order Review</h2>

                    <a
                        className="back-link"
                        onClick={() => setOpen(!open)}
                    >
                        Have a discount code? Save 10%
                    </a>

                    {open && (
                        <div className="discount-box">
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button onClick={applyCode}>Apply</button>
                        </div>
                    )}
                    {error && <p className="error-text">{error}</p>}
                    {success && <p className="success-text">{success}</p>}

                    <div className="summary-line">
                        <span>SubTotal</span>
                        <span>Rs. {subTotal}</span>
                    </div>

                    <div className="summary-line">
                        <span>Shipping</span>
                        <span>Rs. {shipping}</span>
                    </div>

                    <div className="summary-line total">
                        <span>Order Total</span>
                        <span>Rs. {grandTotal}</span>
                    </div>

                    {grandTotal === 0 && (
                        <button className="disabled-btn" disabled>
                            Fill Required Fields
                        </button>
                    )}

                    <p className="terms-text">
                        By placing your order, you agree to the terms and conditions.
                    </p>

                    <button
                        type="submit"
                        className="order-now-btn"
                        disabled={grandTotal === 0}
                        onClick={handleSubmit}
                    >


                        {isSubmitting ? "Placing Order..." : `Order Now`}
                    </button>




                    {isModalOpen && <OrderSuccessModal order={orderData} close={() => setIsModalOpen(false)} />}

                </div>

            </div>
        </>

    );
}
