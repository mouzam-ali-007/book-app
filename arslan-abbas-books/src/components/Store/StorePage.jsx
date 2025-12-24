import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StorePage.css";
import { BASE_URL } from "../../utilities/constants";

// --- DATA ---
const PRODUCTS = [
    {
        id: 'musafirat',
        name: 'Musafirat',
        subtitle: 'Limited 1st Edition',
        price: 1500,
        shortDesc: 'Hand-signed & Numbered',
        longDesc: 'In the heart of Lahore, a struggling poet fights his emptiness, his rejection, his longing—for love, for purpose, for truth. Musāfirat is a lyrical novel about the journey from loneliness to connection.',
        genre: 'Literary Romance',
        maxQty: 3,
        note: 'Max 3 copies per person. Shipping begins Dec 27th.',
        inTheBox: ['Signed Copy of Musafirat (Hardcover)', '2 Exclusive Bookmarks', 'Personalized Letter from Author'],
        images: ['/assets/Musafirat_Hardcover.PNG'],
        tags: [{ text: 'NEW', color: '#f97316' }, { text: 'LIMITED', color: '#dc2626' }]
    },
    {
        id: 'complete-works',
        name: 'Complete Works',
        subtitle: '3-Book Bundle',
        price: 3100,
        shortDesc: '3 Books + Save Rs400',
        longDesc: 'Get Musafirat (signed), Dil-e-Khwabzad, and Dard-e-Nayab in one beautiful bundle.',
        genre: 'Bundle',
        maxQty: 2,
        note: 'Saves Rs.400 instantly!',
        inTheBox: ['3 Signed Hardcovers', 'Exclusive Bookmark Set'],
        images: ['/assets/Musafirat_Hardcover.PNG'],
        tags: [{ text: 'BEST DEAL', color: '#fb923c' }]
    },
    {
        id: 'dil-e-khwabzad',
        name: 'Dil-e-Khwabzad',
        subtitle: '9th Edition',
        price: 1000,
        shortDesc: 'The heart in passion',
        genre: 'Poetry',
        maxQty: 5,
        note: 'Ships immediately',
        inTheBox: ['Hardcover + Bookmark'],
        images: ['/assets/Dil-e-Khwabzad.PNG'],
        tags: [{ text: 'BESTSELLER', color: '#d4d4d4' }]
    },
    {
        id: 'dard-e-nayab',
        name: 'Dard-e-nayab',
        subtitle: '3rd Edition',
        price: 1000,
        shortDesc: 'Pain becomes treasure',
        genre: 'Poetry',
        maxQty: 5,
        note: 'Edition 3 • Ships now',
        inTheBox: ['Hardcover + Rare Bookmark'],
        images: ['/assets/Dard-e-Nayaab.PNG'],
        tags: [{ text: 'IN DEMAND', color: '#d4d4d4' }]
    }
];



const COUPONS = {

    'DKZ10': 0.10,
    'DEN10': 0.10,

};

const PAYMENT_ACCOUNTS = {
    'Bank Alfalah': { title: 'Jahanzaad Books', number: 'PK61ALFH0447001010306852', label: 'IBAN' },
    'Jazzcash': { title: 'Jahanzaad Books', number: '03221080910', label: 'Account Number' },
    'Easypaisa': { title: 'Jahanzaad Books', number: '03221080910', label: 'Account Number' },
    'SadaPay': { title: 'Jahanzaad Books', number: '03221080910', label: 'Account Number' }
};

const SHIPPING_COSTS = { standard: 300, express: 600 };

export default function StorePage() {
    const [view, setView] = useState('store');
    const [cart, setCart] = useState([]);

    // Drawer & Interaction State
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [activeProductId, setActiveProductId] = useState(null);
    const [drawerQuantities, setDrawerQuantities] = useState({});
    const drawerScrollRef = useRef(null);
    const [isMiniCartOpen, setMiniCartOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // --- CHECKOUT STATE ---
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        altPhone: '',
        email: '',
        address: '',
        landmark: 'Near to ',
        city: '',
        postalCode: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [couponStatus, setCouponStatus] = useState(null);

    const [shippingService, setShippingService] = useState('standard');
    const [editionType, setEditionType] = useState('simple');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [gateway, setGateway] = useState(null);
    const [signatureData, setSignatureData] = useState({ name: '', line: '', custom: '' });
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);

    // --- ACTIONS ---

    const showToast = (msg, type = 'info') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getDrawerQty = (id) => drawerQuantities[id] || 1;
    const changeDrawerQty = (id, delta, max) => {
        setDrawerQuantities(prev => {
            const current = prev[id] || 1;
            const newVal = Math.max(1, Math.min(max, current + delta));
            return { ...prev, [id]: newVal };
        });
    };

    const addToCart = (product, quantity) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                if (existing.qty + quantity > product.maxQty) {
                    showToast(`Limit reached for ${product.name}`, 'error');
                    return prev;
                }
                showToast(`Added ${quantity} ${product.name}(s)`, 'success');
                return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + quantity } : p);
            }
            showToast(`${product.name} added to bag!`, 'success');
            return [...prev, { ...product, qty: quantity }];
        });
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));

    const updateCartQty = (id, delta) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const product = PRODUCTS.find(prod => prod.id === id);
                const newQty = Math.max(1, Math.min(product.maxQty, p.qty + delta));
                return { ...p, qty: newQty };
            }
            return p;
        }));
    };

    const openDrawer = (id) => {
        setDrawerOpen(true);
        setActiveProductId(id);
        setTimeout(() => {
            if (drawerScrollRef.current) {
                const index = PRODUCTS.findIndex(p => p.id === id);
                if (index !== -1) {
                    const isDesktop = window.innerWidth >= 768;
                    const cardWidth = isDesktop ? 384 : window.innerWidth * 0.85;
                    const gap = 24;
                    drawerScrollRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: 'instant' });
                }
            }
        }, 10);
    };

    const handleDrawerScroll = () => {
        if (!drawerScrollRef.current) return;
        const isDesktop = window.innerWidth >= 768;
        const cardWidth = isDesktop ? 384 : window.innerWidth * 0.85;
        const index = Math.round(drawerScrollRef.current.scrollLeft / (cardWidth + 24));
        const product = PRODUCTS[index];
        if (product && product.id !== activeProductId) setActiveProductId(product.id);
    };

    // --- CHECKOUT LOGIC ---

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }

        if (field === 'altPhone' || field === 'phone') {
            const phone = field === 'phone' ? value : formData.phone;
            const alt = field === 'altPhone' ? value : formData.altPhone;

            if (phone && alt && phone === alt) {
                setErrors(prev => ({ ...prev, altPhone: "Alternative number must be different" }));
            } else {
                setErrors(prev => {
                    if (prev.altPhone === "Alternative number must be different") {
                        const newErr = { ...prev };
                        delete newErr.altPhone;
                        return newErr;
                    }
                    return prev;
                });
            }
        }
    };

    const applyCoupon = () => {
        const code = couponCode.toUpperCase();
        if (!code) return;

        if (COUPONS[code]) {
            if (COUPONS[code] === 'free_shipping') setAppliedDiscount({ type: 'shipping', code });
            else setAppliedDiscount({ type: 'percent', val: COUPONS[code], code });
            setCouponStatus({ type: 'success', msg: 'Code applied successfully!' });
        } else {
            setCouponStatus({ type: 'error', msg: "Code doesn't match. Please try another." });
            setAppliedDiscount(null);
        }
    };

    const closeSuccessModal = () => {
        setView(null); // or 'store' / 'cart' / whatever your default view is
        navigate('/')
    };

    const calculateTotals = () => {
        const itemsTotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
        let shipping = shippingService === 'express' ? SHIPPING_COSTS.express : SHIPPING_COSTS.standard;

        let codeDiscountAmount = 0;
        if (appliedDiscount) {
            if (appliedDiscount.type === 'shipping') shipping = 0;
            if (appliedDiscount.type === 'percent') codeDiscountAmount = itemsTotal * appliedDiscount.val;
        }

        let prepayDiscountAmount = 0;
        if (paymentMethod === 'prepayment') {
            prepayDiscountAmount = 300;
        }

        const grossTotal = itemsTotal + shipping;
        const total = grossTotal - codeDiscountAmount - prepayDiscountAmount;

        return {
            itemsTotal,
            shipping,
            grossTotal,
            codeDiscountAmount,
            prepayDiscountAmount,
            total: Math.max(0, total)
        };
    };

    const { itemsTotal, shipping, grossTotal, codeDiscountAmount, prepayDiscountAmount, total } = calculateTotals();
    const hasDiscounts = codeDiscountAmount > 0 || prepayDiscountAmount > 0;

    const validateAndOrder = async () => {
        const newErrors = {};
        const { name, phone, altPhone, email, address, city, landmark } = formData;

        if (!name) newErrors.name = "Full Name is required";
        if (!phone) newErrors.phone = "Phone Number is required";
        if (!altPhone) newErrors.altPhone = "Alternative Contact is required";
        if (!email) newErrors.email = "Email Address is required";
        if (!address) newErrors.address = "Full Address is required";
        if (!city) newErrors.city = "City is required";
        if (!landmark || landmark.trim() === 'Near to') newErrors.landmark = "Landmark is required";

        if (phone && altPhone && phone === altPhone) {
            newErrors.altPhone = "Alternative number must be different";
        }

        if (paymentMethod === 'prepayment' && !gateway) {
            showToast("Please select a payment gateway", 'error');
            return;
        }

        if (editionType === 'signed') {
            if (!signatureData.name) newErrors.sigName = "Name for signature is required";
            if (!signatureData.line) newErrors.sigLine = "Please select a poetry line";
            if (signatureData.line === 'other' && !signatureData.custom) newErrors.sigCustom = "Custom text is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorId = Object.keys(newErrors)[0];
            const element = document.getElementById(firstErrorId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast("Please fill all required fields", 'error');
            }
        } else {
            // Generate ID and Submit
            const newId = `JHZ-${Math.floor(10000 + Math.random() * 90000)}`;
            setOrderId(newId);

            setIsProcessing(true);

            // Format cart items for API
            const formattedBooks = cart.map(item => ({
                bookId: item.id,
                title: item.name,
                price: item.price,
                quantity: item.qty,
                total: item.price * item.qty,
            }));

            // Calculate totals
            const subTotalAfterDiscount = itemsTotal - codeDiscountAmount;

            const orderRequest = {
                customer: {
                    fullName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    notes: formData.notes,
                    landmark: formData.landmark
                },
                books: formattedBooks,
                shipping: {
                    method: shippingService,
                    cost: shipping,
                },
                totals: {
                    subTotal: subTotalAfterDiscount,
                    shipping,
                    grandTotal: total,
                },
                orderId: newId,
                status: "Pending",
                ...(editionType === "simple" && { edition: 'simple' }),
                ...(editionType === "signed" && { 
                    edition: "signed", 
                    signed: { 
                        name: signatureData.name, 
                        line: signatureData.line === 'other' ? signatureData.custom : signatureData.line 
                    } 
                }),
                ...(paymentMethod === "cod" && { method: "cod" }),
                ...(paymentMethod !== "cod" && { method: { prepayment: gateway } }),
                ...(appliedDiscount && appliedDiscount.code && { code: appliedDiscount.code }),
            };

            const url = `${BASE_URL}api/order`;

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderRequest),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const responseData = await res.json();

                // Store order in localStorage
                localStorage.setItem("checkoutOrder", JSON.stringify(orderRequest));
                
                // Clear cart
                setCart([]);
                localStorage.removeItem('cartItems');

                setIsProcessing(false);
                setView('success');
                window.scrollTo(0, 0);

            } catch (err) {
                console.error("Order submission error:", err);
                showToast("Something went wrong. Please try again.", 'error');
                setIsProcessing(false);
            }
        }
    };

    const generateWhatsAppLink = () => {
        let message = '';
        if (paymentMethod === 'prepayment') {
            message = `Salam! I have transferred Rs. ${total.toLocaleString()} for my order ${orderId}. Here's the screenshot attached.`;
        } else {
            message = `Salam! I have placed Order ${orderId} via COD. Please confirm shipment.`;
        }

        const itemsList = cart.map(i => `- ${i.name} (x${i.qty})`).join('\n');
        const sigText = editionType === 'signed' ? `\n*Signature Request:*\nTo: ${signatureData.name}\nLine: ${signatureData.line === 'other' ? signatureData.custom : signatureData.line}` : '';

        const fullDetails = `\n\n----------------\n*ORDER DETAILS:*\n${itemsList}${sigText}\n\n*SHIPPING:* \n${formData.name}\n${formData.phone}\n${formData.address}, ${formData.landmark}, ${formData.city}`;

        return `https://wa.me/923221080910?text=${encodeURIComponent(message + fullDetails)}`;
    };

    useEffect(() => {
        if (editionType === 'signed') {
            setPaymentMethod('prepayment');
        }
    }, [editionType]);

    const getInputClass = (fieldKey) => {
        const baseClass = 'store-input';
        return errors[fieldKey] ? `${baseClass} ${baseClass}--error` : baseClass;
    };

    const firstName = formData.name ? formData.name.split(' ')[0] : 'Author';
    const selectedAccount = gateway ? PAYMENT_ACCOUNTS[gateway] : null;

    return (
        <div className="store-page">
            {/* TOAST */}
            {toast && (
                <div className={`store-toast store-toast--${toast.type}`}>
                    {toast.msg}
                </div>
            )}

            {/* --- VIEW 1: STORE --- */}
            {view === 'store' && (
                <section className="store-view">
                    {/* Header */}
                    <div className="store-header">
                        <Link to="/" className="store-back-link">&larr; Back to Home</Link>
                        <h1 className="store-title">All books.</h1>
                        <p className="store-subtitle">Hand-signed. Limited. Yours forever.</p>
                    </div>

                    {/* MAIN GRID */}
                    <div className="store-products-container">
                        <div className="store-products-scroll">
                            {PRODUCTS.map(p => (
                                <div key={p.id} className="store-product-card">
                                    <div className="store-product-clickable" onClick={() => openDrawer(p.id)}>
                                        <div className="store-product-tags">
                                            {p.tags.map(t => <span key={t.text} className="store-tag" style={{ color: t.color }}>{t.text}</span>)}
                                        </div>
                                        <div className="store-product-content">
                                            <h3 className="store-product-name">{p.name}</h3>
                                            <p className="store-product-shortdesc">{p.shortDesc}</p>
                                            <div className="store-product-image-wrapper">
                                                <img src={p.images[0]} alt={p.name} className="store-product-image" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="store-product-footer">
                                        <div className="store-product-actions">
                                            <p className="store-product-price">Rs. {p.price}</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(p, 1); }}
                                                className="store-add-button">
                                                Add +
                                            </button>
                                        </div>
                                        <p onClick={() => openDrawer(p.id)} className="store-view-details">View Details &rarr;</p>
                                    </div>
                                </div>
                            ))}
                            <div className="store-products-spacer"></div>
                        </div>
                    </div>

                    {/* Floating Bag */}
                    <div className="store-floating-bag">
                        <button onClick={() => setMiniCartOpen(true)} className="store-bag-button">
                            <svg className="store-bag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span>Bag</span>
                            {cart.length > 0 && <span className="store-bag-count">{cart.reduce((a, b) => a + b.qty, 0)}</span>}
                        </button>
                    </div>

                    <div className="store-checkout-button-wrapper">
                        <button onClick={() => setView('checkout')} disabled={cart.length === 0} className={`store-checkout-btn ${cart.length === 0 ? 'store-checkout-btn--disabled' : ''}`}>
                            Proceed to Checkout
                        </button>
                    </div>
                </section>
            )}

            {/* --- DRAWER --- */}
            <div className={`store-drawer-overlay ${isDrawerOpen ? 'store-drawer-overlay--open' : ''}`}>
                <div className="store-drawer-backdrop" onClick={() => setDrawerOpen(false)}></div>

                <div className={`store-drawer-content ${isDrawerOpen ? 'store-drawer-content--open' : ''}`}>
                    <div className="store-drawer-header">
                        <h2 className="store-drawer-title">
                            {activeProductId ? PRODUCTS.find(p => p.id === activeProductId)?.name : ''}
                        </h2>
                        <button onClick={() => setDrawerOpen(false)} className="store-drawer-close">
                            <svg className="store-drawer-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div ref={drawerScrollRef} onScroll={handleDrawerScroll} className="store-drawer-scroll">
                        {PRODUCTS.map(p => {
                            const currentQty = getDrawerQty(p.id);
                            return (
                                <div key={p.id} className="store-drawer-item">
                                    <div className="store-drawer-card">
                                        <h3 className="store-drawer-card-name">{p.name}</h3>
                                        <p className="store-drawer-card-subtitle">{p.subtitle}</p>

                                        <div className="store-drawer-price-badge">
                                            <span className="store-drawer-price">Rs. {p.price}</span>
                                        </div>

                                        <div className="store-drawer-qty-controls">
                                            <button onClick={() => changeDrawerQty(p.id, -1, p.maxQty)} disabled={currentQty <= 1} className="store-drawer-qty-btn">-</button>
                                            <button onClick={() => addToCart(p, currentQty)} className="store-drawer-add-btn">
                                                Add {currentQty} to Bag
                                            </button>
                                            <button onClick={() => changeDrawerQty(p.id, 1, p.maxQty)} disabled={currentQty >= p.maxQty} className="store-drawer-qty-btn">+</button>
                                        </div>

                                        <div className="store-drawer-image-wrapper">
                                            <img src={p.images[0]} alt={p.name} className="store-drawer-image" />
                                        </div>

                                        <div className="store-drawer-details">
                                            <div className="store-drawer-section">
                                                <h3 className="store-drawer-section-title">Overview</h3>
                                                <p className="store-drawer-section-text">{p.longDesc}</p>
                                            </div>

                                            <div className="store-drawer-section">
                                                <h3 className="store-drawer-section-title">In the Box</h3>
                                                <ul className="store-drawer-list">
                                                    {p.inTheBox.map(i => <li key={i} className="store-drawer-list-item"><span className="store-drawer-check">✓</span> {i}</li>)}
                                                </ul>
                                            </div>

                                            <div className="store-drawer-section store-drawer-section--border">
                                                <div className="store-drawer-qty-controls">
                                                    <button onClick={() => changeDrawerQty(p.id, -1, p.maxQty)} disabled={currentQty <= 1} className="store-drawer-qty-btn">-</button>
                                                    <button onClick={() => addToCart(p, currentQty)} className="store-drawer-add-btn">
                                                        Add {currentQty} to Bag
                                                    </button>
                                                    <button onClick={() => changeDrawerQty(p.id, 1, p.maxQty)} disabled={currentQty >= p.maxQty} className="store-drawer-qty-btn">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="store-drawer-spacer"></div>
                    </div>
                </div>
            </div>

            {/* --- MINI CART --- */}
            {isMiniCartOpen && (
                <div className="store-minicart-overlay">
                    <div className="store-minicart-backdrop" onClick={() => setMiniCartOpen(false)}></div>
                    <div className="store-minicart">
                        <div className="store-minicart-header">
                            <h3 className="store-minicart-title">Your Bag</h3>
                            <button onClick={() => setMiniCartOpen(false)} className="store-minicart-close">✕</button>
                        </div>

                        <div className="store-minicart-items">
                            {cart.length === 0 ? <div className="store-minicart-empty"><p>Your bag is empty.</p></div> : cart.map(item => (
                                <div key={item.id} className="store-minicart-item">
                                    <div className="store-minicart-item-info">
                                        <div className="store-minicart-item-name">{item.name}</div>
                                        <div className="store-minicart-item-details">Rs. {item.price} x {item.qty}</div>
                                    </div>
                                    <div className="store-minicart-item-actions">
                                        <span className="store-minicart-item-price">Rs. {(item.price * item.qty).toLocaleString()}</span>
                                        <div className="store-minicart-item-controls">
                                            <button onClick={() => updateCartQty(item.id, -1)} className="store-minicart-qty-btn">-</button>
                                            <button onClick={() => updateCartQty(item.id, 1)} className="store-minicart-qty-btn">+</button>
                                            <button onClick={() => removeFromCart(item.id)} className="store-minicart-remove-btn">
                                                <svg className="store-minicart-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="store-minicart-footer">
                            <div className="store-minicart-total">
                                <span>Total</span>
                                <span>Rs. {itemsTotal.toLocaleString()}</span>
                            </div>
                            <button onClick={() => { setMiniCartOpen(false); setView('checkout'); }} className="store-minicart-checkout-btn">Checkout</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW 2: CHECKOUT --- */}
            {view === 'checkout' && (
                <section className="store-checkout">
                    <button onClick={() => setView('store')} className="store-back-link">
                        &larr; Return to Store
                    </button>

                    <div className="store-checkout-header">
                        <h1 className="store-checkout-title">Checkout</h1>
                        <p className="store-checkout-subtitle">Complete your order to secure your limited edition copy.</p>
                    </div>

                    <div className="store-checkout-grid">
                        {/* LEFT COLUMN: FORMS */}
                        <div className="store-checkout-left">
                            {/* 1. CART ITEMS */}
                            <div className="store-checkout-section">
                                <h2 className="store-checkout-section-title">
                                    <span className="store-checkout-section-number">1</span>
                                    Your Items
                                </h2>
                                <div className="store-checkout-items-list">
                                    {cart.map(item => (
                                        <div key={item.id} className="store-checkout-item">
                                            <div className="store-checkout-item-left">
                                                <div className="store-checkout-item-image-wrapper">
                                                    <img src={PRODUCTS.find(p => p.id === item.id).images[0]} alt={item.name} className="store-checkout-item-image" />
                                                </div>
                                                <div>
                                                    <h4 className="store-checkout-item-name">{item.name}</h4>
                                                    <p className="store-checkout-item-details">Rs. {item.price} x {item.qty}</p>
                                                </div>
                                            </div>
                                            <div className="store-checkout-item-right">
                                                <div className="store-checkout-item-qty-controls">
                                                    <button onClick={() => updateCartQty(item.id, -1)} className="store-checkout-qty-btn">-</button>
                                                    <span className="store-checkout-qty-value">{item.qty}</span>
                                                    <button onClick={() => updateCartQty(item.id, 1)} className="store-checkout-qty-btn">+</button>
                                                </div>
                                                <p className="store-checkout-item-price">Rs. {(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. SHIPPING DETAILS */}
                            <div className="store-checkout-section">
                                <h2 className="store-checkout-section-title">
                                    <span className="store-checkout-section-number">2</span>
                                    Shipping Details
                                </h2>
                                <div className="store-checkout-form">
                                    <div>
                                        <input id="name" autoComplete="name" placeholder="Full Name" className={getInputClass('name')} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                                        {errors.name && <p className="store-error-text">{errors.name}</p>}
                                    </div>

                                    <div className="store-checkout-form-row">
                                        <div>
                                            <input id="phone" autoComplete="tel" placeholder="Active Contact" className={getInputClass('phone')} type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                                            {errors.phone && <p className="store-error-text">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <input id="altPhone" autoComplete="tel" placeholder="Alternative Contact" className={getInputClass('altPhone')} type="tel" value={formData.altPhone} onChange={e => handleInputChange('altPhone', e.target.value)} />
                                            {errors.altPhone && <p className="store-error-text">{errors.altPhone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <input id="email" autoComplete="email" placeholder="Email Address" className={getInputClass('email')} type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                                        {errors.email && <p className="store-error-text">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <input id="address" autoComplete="street-address" placeholder="Full Address (House, Street, Area)" className={getInputClass('address')} value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
                                        {errors.address && <p className="store-error-text">{errors.address}</p>}
                                    </div>

                                    <div className={`store-landmark-input ${errors.landmark ? 'store-landmark-input--error' : ''}`}>
                                        <span className="store-landmark-prefix">Near to</span>
                                        <input
                                            autoComplete="off"
                                            className="store-landmark-field"
                                            placeholder="(Landmark)"
                                            value={formData.landmark.replace('Near to ', '')}
                                            onChange={e => handleInputChange('landmark', 'Near to ' + e.target.value)}
                                        />
                                    </div>
                                    {errors.landmark && <p className="store-error-text">{errors.landmark}</p>}

                                    <div className="store-checkout-form-row">
                                        <div>
                                            <input id="city" autoComplete="address-level2" placeholder="City" className={getInputClass('city')} value={formData.city} onChange={e => handleInputChange('city', e.target.value)} />
                                            {errors.city && <p className="store-error-text">{errors.city}</p>}
                                        </div>
                                        <input placeholder="Postal Code (Optional)" autoComplete="postal-code" className={getInputClass('postalCode')} value={formData.postalCode} onChange={e => handleInputChange('postalCode', e.target.value)} />
                                    </div>

                                    <textarea placeholder="Order Notes (Optional)" className={`${getInputClass('notes')} store-textarea`} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)}></textarea>
                                </div>
                            </div>

                            {/* 3. SHIPPING SERVICE */}
                            <div className="store-checkout-section">
                                <h2 className="store-checkout-section-title">
                                    <span className="store-checkout-section-number">3</span>
                                    Delivery Method
                                </h2>
                                <div className="store-shipping-options">
                                    <label className={`store-shipping-option ${shippingService === 'standard' ? 'store-shipping-option--active' : ''}`}>
                                        <input type="radio" name="ship" checked={shippingService === 'standard'} onChange={() => setShippingService('standard')} className="store-radio" />
                                        <div className="store-shipping-option-content">
                                            <p className="store-shipping-option-title">Standard Shipping</p>
                                            <p className="store-shipping-option-desc">5-7 Working Days</p>
                                        </div>
                                        <span className="store-shipping-option-price">Rs. {SHIPPING_COSTS.standard}</span>
                                    </label>

                                    <label className={`store-shipping-option ${shippingService === 'express' ? 'store-shipping-option--active' : ''}`}>
                                        <input type="radio" name="ship" checked={shippingService === 'express'} onChange={() => setShippingService('express')} className="store-radio" />
                                        <div className="store-shipping-option-content">
                                            <p className="store-shipping-option-title">Express Shipping</p>
                                            <p className="store-shipping-option-desc">1-2 Working Days (TCS)</p>
                                        </div>
                                        <span className="store-shipping-option-price">Rs. {SHIPPING_COSTS.express}</span>
                                    </label>
                                </div>
                            </div>

                            {/* 4. PREFERENCES & PAYMENT */}
                            <div className="store-checkout-section">
                                <h2 className="store-checkout-section-title">
                                    <span className="store-checkout-section-number">4</span>
                                    Preferences
                                </h2>

                                {/* Edition Selection */}
                                <div className="store-edition-selection">
                                    <p className="store-edition-label">Select Edition</p>
                                    <div className="store-edition-options">
                                        <label className={`store-edition-option ${editionType === 'simple' ? 'store-edition-option--active' : ''}`}>
                                            <input type="radio" name="edition" value="simple" checked={editionType === 'simple'} onChange={() => setEditionType('simple')} className="store-radio-hidden" />
                                            <span className="store-edition-option-text">Simple Copy</span>
                                        </label>
                                        <label className={`store-edition-option ${editionType === 'signed' ? 'store-edition-option--active' : ''}`}>
                                            <input type="radio" name="edition" value="signed" checked={editionType === 'signed'} onChange={() => setEditionType('signed')} className="store-radio-hidden" />
                                            <span className="store-edition-option-text">
                                                <span className="store-edition-option-main">Signed Copy</span>
                                                <span className="store-edition-option-note">(Pre-payment Only)</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Signature Logic */}
                                {editionType === 'signed' && (
                                    <div className="store-signature-section">
                                        <h3 className="store-signature-title">Signature Details</h3>
                                        <input id="sigName" placeholder="Sign for (Name)" className={`${getInputClass('sigName')} store-signature-input`} value={signatureData.name} onChange={e => setSignatureData({ ...signatureData, name: e.target.value })} />
                                        {errors.sigName && <p className="store-error-text">{errors.sigName}</p>}

                                        <select className={`${getInputClass('sigLine')} store-signature-select`} value={signatureData.line} onChange={e => setSignatureData({ ...signatureData, line: e.target.value })}>
                                            <option value="">Select a couplet (Optional)...</option>
                                            <option value="DKZ L1">Dil-e-Khwabzad (Opening Line)</option>
                                            <option value="DN L1">Dard-e-Nayab (Opening Line)</option>
                                            <option value="other">Custom Line...</option>
                                        </select>
                                        {signatureData.line === 'other' && (
                                            <>
                                                <input id="sigCustom" placeholder="Enter custom text (Max 10 words)" className={getInputClass('sigCustom')} value={signatureData.custom} onChange={e => setSignatureData({ ...signatureData, custom: e.target.value })} />
                                                {errors.sigCustom && <p className="store-error-text">{errors.sigCustom}</p>}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div className="store-payment-methods">
                                    <p className="store-payment-label">Payment Method</p>
                                    <div className="store-payment-options-list">
                                        <label className={`store-payment-option ${editionType === 'signed' ? 'store-payment-option--disabled' : ''} ${paymentMethod === 'cod' ? 'store-payment-option--active' : ''}`}>
                                            <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => editionType !== 'signed' && setPaymentMethod('cod')} disabled={editionType === 'signed'} className="store-radio" />
                                            <div className="store-payment-option-content">
                                                <span className="store-payment-option-title">Cash on Delivery (COD)</span>
                                                <span className="store-payment-option-desc">Ships on 1st January 2026</span>
                                            </div>
                                        </label>

                                        <label className={`store-payment-option ${paymentMethod === 'prepayment' ? 'store-payment-option--active' : ''}`}>
                                            <input type="radio" name="payment" checked={paymentMethod === 'prepayment'} onChange={() => setPaymentMethod('prepayment')} className="store-radio" />
                                            <div className="store-payment-option-content">
                                                <span className="store-payment-option-title">Pre-payment / Bank Transfer</span>
                                                <span className="store-payment-option-desc store-payment-option-desc--green">Ships Immediately + Saves Rs. 300</span>
                                            </div>
                                        </label>

                                        {/* Gateway Selection */}
                                        {paymentMethod === 'prepayment' && (
                                            <div className="store-gateway-selection">
                                                {['Bank Alfalah', 'Jazzcash', 'Easypaisa', 'SadaPay'].map(g => (
                                                    <label key={g} className={`store-gateway-option ${gateway === g ? 'store-gateway-option--active' : ''}`}>
                                                        <input type="radio" name="gateway" value={g} onChange={() => setGateway(g)} className="store-radio-hidden" />
                                                        {g}
                                                    </label>
                                                ))}
                                                <p className="store-gateway-note">
                                                    Transfer details will be shown after order placement
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SUMMARY */}
                        <div className="store-checkout-right">
                            <div className="store-summary-card">
                                <h2 className="store-summary-title">Total</h2>

                                {/* Discount Input */}
                                <div className="store-coupon-section">
                                    <div className="store-coupon-input-wrapper">
                                        <input
                                            placeholder="Discount Code"
                                            className="store-coupon-input"
                                            value={couponCode}
                                            onChange={e => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponStatus(null);
                                            }}
                                        />
                                        <button onClick={applyCoupon} className="store-coupon-button">Apply</button>
                                    </div>
                                    {couponStatus && (
                                        <p className={`store-coupon-status store-coupon-status--${couponStatus.type}`}>
                                            {couponStatus.msg}
                                        </p>
                                    )}
                                </div>

                                {/* Calculations */}
                                <div className="store-summary-breakdown">
                                    <div className="store-summary-line">
                                        <span>Item Total</span>
                                        <span>Rs. {itemsTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="store-summary-line">
                                        <span>Shipping ({shippingService})</span>
                                        <span>{shipping === 0 ? <span className="store-summary-free">FREE</span> : `Rs. ${shipping}`}</span>
                                    </div>

                                    {hasDiscounts && (
                                        <>
                                            <div className="store-summary-divider"></div>
                                            <div className="store-summary-line store-summary-line--bold">
                                                <span>Subtotal</span>
                                                <span>Rs. {grossTotal.toLocaleString()}</span>
                                            </div>

                                            {codeDiscountAmount > 0 && (
                                                <div className="store-summary-line store-summary-line--discount">
                                                    <span>Code Discount</span>
                                                    <span>- Rs. {codeDiscountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {prepayDiscountAmount > 0 && (
                                                <div className="store-summary-line store-summary-line--discount">
                                                    <span>PrePay Saving</span>
                                                    <span>- Rs. {prepayDiscountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="store-summary-total">
                                    <span className="store-summary-total-label">Total to Pay</span>
                                    <span className="store-summary-total-amount">Rs. {total.toLocaleString()}</span>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <button onClick={validateAndOrder} disabled={isProcessing} className="store-submit-button">
                                    {isProcessing ? (
                                        <svg className="store-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="store-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="store-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        paymentMethod === 'cod' ? 'Complete Order' : 'Proceed to Payment'
                                    )}
                                </button>

                                <p className="store-summary-note">
                                    Secure checkout powered by WhatsApp. No card info stored.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- VIEW 3: SUCCESS --- */}
            {view === 'success' && (
                <div className="store-success-overlay">
                    <div className="store-success-modal">
                        {/* TITLE BAR */}
                        <div className="store-success-header">
                            <span className="store-success-header-title">Order Receipt</span>
                            <button
                                className="store-success-close-btn"
                                onClick={closeSuccessModal}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                            {/* <button onClick={() => window.print()} className="store-success-print-btn">
                                <svg className="store-success-print-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Save Receipt
                            </button> */}
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="store-success-content">
                            {/* ANIMATED TICK */}
                            <div className="store-success-tick-wrapper">
                                <div className="store-success-tick">
                                    <svg className="store-success-tick-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>

                            <h2 className="store-success-title">Thank you, {firstName}!</h2>
                            <p className="store-success-message">
                                Your order has been placed. {paymentMethod === 'prepayment'
                                    ? 'Please complete the transfer below to finalize your booking.'
                                    : 'Please confirm your details via WhatsApp to ensure timely delivery.'}
                            </p>

                            {/* Order ID & Status Badges */}
                            <div className="store-success-order-info">
                                <p className="store-success-order-label">Order Number</p>
                                <p className="store-success-order-id">#{orderId}</p>

                                <div className="store-success-badges">
                                    <span className="store-success-badge store-success-badge--blue">Order: Received</span>
                                    <span className="store-success-badge store-success-badge--yellow">Payment: Pending</span>
                                </div>
                            </div>

                            {/* DYNAMIC Payment Details */}
                            {paymentMethod === 'prepayment' && selectedAccount && (
                                <div className="store-success-payment-details">
                                    <p className="store-success-payment-label">Transfer Details ({gateway})</p>
                                    <div className="store-success-payment-info">
                                        <p className="store-success-payment-title">{selectedAccount.title}</p>
                                        <p className="store-success-payment-account-label">{selectedAccount.label}</p>
                                        <p className="store-success-payment-number">{selectedAccount.number}</p>

                                    </div>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="store-success-summary">
                                <h3 className="store-success-summary-title">Order Summary</h3>
                                {cart.map(item => (
                                    <div key={item.id} className="store-success-summary-item">
                                        <div className="store-success-summary-item-left">
                                            <div className="store-success-summary-item-image-wrapper">
                                                <img src={PRODUCTS.find(p => p.id === item.id).images[0]} alt="cover" className="store-success-summary-item-image" />
                                            </div>
                                            <div>
                                                <p className="store-success-summary-item-name">{item.name}</p>
                                                <p className="store-success-summary-item-qty">Qty: {item.qty}</p>
                                            </div>
                                        </div>
                                        <span className="store-success-summary-item-price">Rs. {(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}

                                <div className="store-success-summary-divider"></div>

                                <div className="store-success-summary-line">
                                    <span className="store-success-summary-label">Shipping To</span>
                                    <span className="store-success-summary-value">{formData.address}</span>
                                </div>

                                <div className="store-success-summary-total-line">
                                    <span className="store-success-summary-total-label">Total Amount</span>
                                    <span className="store-success-summary-total-value">Rs. {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* STICKY FOOTER BUTTON */}
                        <div className="store-success-footer">
                            <p className="store-success-footer-text">
                                {paymentMethod === 'prepayment' ? 'Transferred the amount?' : 'Ready to confirm?'}
                            </p>
                            <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="store-success-whatsapp-button">
                                <svg className="store-success-whatsapp-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                {paymentMethod === 'prepayment' ? 'Send Screenshot' : 'Confirm via WhatsApp'}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

