import React, { useEffect, useState } from "react";
import "./Checkout.css";
import Navbar from "../navbar/Nav";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderSuccessModal from "../OrderSuccess/orderSuccess";


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


    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
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




    const shipping = shippingMethod === "express"
        ? 800
        : 300;

    const grandTotal = subTotal + shipping;

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shipping = subTotal === 0
            ? 0
            : shippingMethod === "express"
                ? 800
                : 300;





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

        if (items.length === 0) {
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
            books: items,
            shipping: {
                method: shippingMethod,
                cost: shipping,
            },
            payment: {
                method: "Cash on Delivery",
            },
            totals: {
                subtotal,
                shipping,
                grandTotal,
            },
            status: "Pending",

        };


        setOrderData(orderRequest)
        setIsSubmitting(true);


        try {
            const res = await fetch("http://localhost:8001/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderRequest),
            });


            localStorage.setItem("checkoutOrder", JSON.stringify(orderRequest));
            setIsSubmitting(false);
            setIsModalOpen(true)
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
            setIsSubmitting(false);
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
            />



            <div className="checkout-wrapper">

                <div className="back-store">
                    <a onClick={handleBack} className="back-link">← Back to Store</a>

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
                        <input type="email"

                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                        />
                        <input type="text"
                            name="phone"
                            value={formData.phone}
                            placeholder="Phone Number"

                            onChange={handleChange}

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




                {/* PAYMENT */}
                <div className="checkout-card">
                    <h2 className="section-title">Payment</h2>

                    <p className="payment-note">
                        Currently, only Cash on Delivery (COD) is supported for this region.
                    </p>

                    <label className="payment-option">
                        <input type="radio" checked readOnly />
                        <span>Cash on Delivery (COD)</span>
                    </label>
                </div>

                {/* ORDER SUMMARY */}
                <div className="checkout-card">
                    <h2 className="section-title">Order Summary</h2>

                    <div className="summary-line">
                        <span>Subtotal</span>
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
