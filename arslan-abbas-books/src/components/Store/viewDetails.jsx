import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext.jsx";
import "./viewDetails.css";
import { PRODUCTS } from "../../utilities/constants";
import { ToastContainer, toast, Slide, Zoom, Flip } from 'react-toastify';
import { FiShoppingCart } from "react-icons/fi";

const ViewDetailsModal = ({ book, close, onNext, onPrev }) => {
    const [index, setIndex] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const [rotateY, setRotateY] = useState(-25); // Default perspective angle

    const [orderCount, setOrderCount] = useState(1);
    const { addToCart, toggleBag, cartItems, totalCount } = useCart();

    const [isClosing, setIsClosing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const closeModal = () => {
        close()
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 250); // match animation time
    };

    const showToaster = (version, count) => {
        if (count === 0) {
            toast.warning("Limit completed for this book");
            return;
        }
        addToCart(version, count);
        toast.success("Added to the bag");
    };

    const [version, setVersion] = useState(null);
    // Reset image index and rotation when book changes
    useEffect(() => {
        setIndex(0);
        setRotateY(-25);

        if (!book?.title) return;

        const matchedProduct = PRODUCTS[book.title];
        setVersion(matchedProduct || null);

        // Set orderCount based on available slots
        if (matchedProduct) {
            const existingItem = cartItems.find((item) => item.title === matchedProduct.title);
            const currentQty = existingItem ? existingItem.quantity : 0;
            const maxAllowed = matchedProduct.max - currentQty;
            setOrderCount(maxAllowed > 0 ? 1 : 0);
        }
    }, [book, cartItems]);



    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onNext, onPrev, close]);

    if (!version) return null;

    const existingItem = cartItems.find((item) => item.title === version.title);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const maxAllowed = version.max - currentQty;


    const increase = () => {
        const existingItem = cartItems.find((item) => item.title === version.title);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const maxAllowed = version.max - currentQty;
        setOrderCount((prev) => Math.min(prev + 1, maxAllowed));
    };

    const decrease = () => {
        setOrderCount((prev) => Math.max(prev - 1, 1));
    };

    const nextImage = () => setIndex((index + 1) % version.images.length);
    const prevImage = () => setIndex((index - 1 + version.images.length) % version.images.length);

    const handleMouseMove = (e) => {
        if (!isRotating) return;
        const width = e.currentTarget.offsetWidth;
        const x = e.nativeEvent.offsetX;
        const rotation = ((x / width) * 360) - 180; // Map cursor position to -180 to 180 degrees
        setRotateY(rotation);
    };

    return (
        <>



            <div className={`details-overlay ${isClosing ? "closing" : ""}`} onClick={closeModal}>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    pauseOnHover
                    closeOnClick
                    transition={Slide}
                    toastClassName="small-toast"
                    bodyClassName="small-toast-body"

                    style={{ marginTop: "10px" }}
                    toastStyle={{
                        transition: "all 0.6s ease"
                    }}
                />



                <div className={`details-modal ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>

                    <div className="modal-header-actions">
                        <button className="close-btn" onClick={closeModal}>✕</button>
                    </div>



                    {/* CARD 2 — PRODUCT INFO */}
                    <div className="card">
                        <h2 className="title">{version.title}</h2>
                        <p className="sub">{version.subtitle || book.tag}</p>
                        <p className="price">{version.price}</p>

                        <div className="order-row">
                            <button className="qty" onClick={() => {
                                if (orderCount <= 1) {
                                    toast.warning("Minimum quantity is 1");
                                    return;
                                }
                                decrease();
                            }}>-</button>
                            <button className="order-btn" onClick={() => showToaster(version, orderCount)}>
                                {orderCount === 0 ? "Limit Reached" : `Order ${orderCount} Copies`}
                            </button>
                            <button className="qty" onClick={() => {
                                if (orderCount >= maxAllowed) {
                                    toast.warning("Maximum limit reached");
                                    return;
                                }
                                increase();
                            }}>+</button>
                        </div>

                        <p className="limit">Max {version.max} per person</p>
                    </div>

                    {/* CARD 1 — IMAGE SLIDER / 3D VIEW */}
                    <div className="card slider-card">
                        <div className="view-toggle">
                            <button
                                className={!isRotating ? "active" : ""}
                                onClick={() => setIsRotating(false)}
                            >
                                Gallery
                            </button>
                            <button
                                className={isRotating ? "active" : ""}
                                onClick={() => setIsRotating(true)}
                            >
                                3D View
                            </button>
                        </div>

                        {!isRotating ? (
                            <>
                                <div className="slider">
                                    <img src={version.images[index]} alt={version.title} loading="lazy" />
                                    <button className="nav left" onClick={prevImage}>‹</button>
                                    <button className="nav right" onClick={nextImage}>›</button>
                                </div>
                                <div className="dots">
                                    {version.images.map((_, i) => (
                                        <span
                                            key={i}
                                            className={i === index ? "dot active" : "dot"}
                                            onClick={() => setIndex(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div
                                className="book-3d-wrapper"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setRotateY(-25)} // Reset on leave
                            >
                                <div
                                    className="book-3d"
                                    style={{ transform: `rotateY(${rotateY}deg)` }}
                                >
                                    <div className="book-face front">

                                        <img src={version.images[index]} alt="Front Cover" loading="lazy" />
                                    </div>
                                    <div className="book-face spine"></div>
                                    <div className="book-face back"></div>
                                </div>
                                <p className="rotate-instruction">Move cursor to rotate</p>
                            </div>
                        )}
                    </div>

                    {/* CARD 3 — OVERVIEW */}
                    <div className="card">
                        <h3 className="overview">Overview</h3>
                        <h3 className="handcover">  <p className="handcover-value">{version.handcover}</p></h3>

                        <p className="description">{version.description}</p>
                    </div>

                    {/* CARD 4 — WHAT’S IN THE BOX */}
                    <div className="card ">
                        <div className="box-item">
                            <h3>What’s in the box</h3>
                            <ul>
                                {version.box && version.box.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>

                        </div>
                        {version.ships && <p className="shipping-details">{version.ships}</p>}
                    </div>
                </div>
                <button className="place-order-btn" onClick={toggleBag}>
                    <FiShoppingCart className="cart-icon" />
                    Bag <span className="bag-count">{totalCount}</span>
                </button>
            </div>


        </>
    );
};

export default ViewDetailsModal;
