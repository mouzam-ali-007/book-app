"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import html2pdf from "html2pdf.js";



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
        images: ['https://placehold.co/800x1000/1a1a1a/cccccc?text=Musafirat+Cover', 'https://placehold.co/800x1000/1a1a1a/cccccc?text=Signed+Page', 'https://placehold.co/800x1000/1a1a1a/cccccc?text=Interior+Shot'],
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
        images: ['https://placehold.co/800x1000/1a1a1a/cccccc?text=Complete+Works', 'https://placehold.co/800x1000/1a1a1a/cccccc?text=Bundle+Open'],
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
        images: ['https://placehold.co/800x1000/1a1a1a/cccccc?text=Dil-e-Khwabzad'],
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
        images: ['https://placehold.co/800x1000/1a1a1a/cccccc?text=Dard-e-Nayab'],
        tags: [{ text: 'IN DEMAND', color: '#d4d4d4' }]
    }
];

const COUPONS = {
    'WELCOME10': 0.10,
    'DKZ10': 0.10,
    'DEN10': 0.10,
    'FIRST20': 0.20,
    'STUD20': 0.20,
    'FREESHIP': 'free_shipping'
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

    const savePDF = () => {
        const element = document.getElementById("receipt");

        const options = {
            margin: 0.5,
            filename: "order-receipt.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(options).from(element).save();
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

    const validateAndOrder = () => {
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
            setTimeout(() => {
                setIsProcessing(false);
                setView('success');
                window.scrollTo(0, 0);
            }, 2000);
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

    const getInputClass = (fieldKey) => `
      w-full rounded-xl px-4 py-2.5 text-base transition-all duration-300 focus:outline-none 
      ${errors[fieldKey]
            ? 'bg-red-900/10 border border-red-500 text-white placeholder:text-red-400/50 focus:border-red-500'
            : 'bg-[#111] border border-[#222] text-white placeholder:text-gray-400 focus:border-indigo-500'}
  `;

    const firstName = formData.name ? formData.name.split(' ')[0] : 'Author';
    const selectedAccount = gateway ? PAYMENT_ACCOUNTS[gateway] : null;

    return (
        <div className="min-h-screen bg-black text-[#f5f5f5] selection:bg-indigo-500 selection:text-white">

            <style jsx>{`
        .checkmark-circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 2; stroke-miterlimit: 10; stroke: #22c55e; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
        .checkmark { width: 80px; height: 80px; border-radius: 50%; display: block; stroke-width: 3; stroke: #fff; stroke-miterlimit: 10; margin: 0 auto 20px; box-shadow: inset 0px 0px 0px #22c55e; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
        .checkmark-check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
        @keyframes stroke { 100% { stroke-dashoffset: 0; } }
        @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
        @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 50px #22c55e; } }
        @keyframes scaleIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        /* HIDE BUTTONS ON PRINT */
        @media print {
            .no-print { display: none !important; }
            .print-only-bg { background-color: #000 !important; color: #000; }
        }
      `}</style>

            {/* TOAST */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[2000] px-6 py-4 rounded-2xl text-sm font-bold text-white shadow-2xl animate-bounce flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-600' : 'bg-[#6366f1]'}`}>
                    {toast.msg}
                </div>
            )}

            {/* --- VIEW 1: STORE --- */}
            {view === 'store' && (
                <section className="min-h-screen pb-20">
                    {/* Header */}
                    <div className="max-w-7xl mx-auto px-6 pt-10">
                        <Link href="/" className="text-indigo-400 text-sm hover:text-indigo-300 transition font-medium">&larr; Back to Home</Link>
                        <h1 className="text-5xl sm:text-7xl font-black text-white mt-6 tracking-tighter">All books.</h1>
                        <p className="text-xl text-gray-400 mt-3 font-light">Hand-signed. Limited. Yours forever.</p>
                    </div>

                    {/* MAIN GRID */}
                    <div className="w-full max-w-7xl mx-auto mt-12 pl-6">
                        <div className="flex overflow-x-auto pb-12 space-x-8 scrollbar-hide snap-x">
                            {PRODUCTS.map(p => (
                                <div key={p.id} className="selection-frame rounded-[2rem] overflow-hidden w-72 flex-shrink-0 relative snap-start bg-[#0a0a0a] border border-[#222]">
                                    <div className="cursor-pointer" onClick={() => openDrawer(p.id)}>
                                        <div className="absolute top-5 left-5 flex flex-col items-start gap-1 z-10">
                                            {p.tags.map(t => <span key={t.text} className="sleek-tag" style={{ color: t.color }}>{t.text}</span>)}
                                        </div>
                                        <div className="p-8 pb-0 text-center flex flex-col">
                                            <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                                            <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">{p.shortDesc}</p>
                                            <div className="mt-8 mx-auto rounded-xl h-52 w-full relative overflow-hidden shadow-2xl">
                                                <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-6 mt-auto">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-medium text-indigo-400">Rs. {p.price}</p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(p, 1); }}
                                                className="px-5 py-2 bg-white/10 hover:bg-white/20 active:bg-indigo-600 active:scale-95 text-white text-xs font-bold rounded-full transition-all z-20 relative backdrop-blur-md">
                                                Add +
                                            </button>
                                        </div>
                                        <p onClick={() => openDrawer(p.id)} className="text-xs text-center text-gray-400 hover:text-white transition-colors cursor-pointer">View Details &rarr;</p>
                                    </div>
                                </div>
                            ))}
                            <div className="w-6 flex-shrink-0"></div>
                        </div>
                    </div>

                    {/* Floating Bag */}
                    <div className="fixed right-5 bottom-10 z-50">
                        <button onClick={() => setMiniCartOpen(true)} className="bg-[#6366f1] text-white rounded-full px-6 py-4 shadow-2xl shadow-indigo-500/30 flex items-center gap-3 font-bold hover:scale-105 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <span>Bag</span>
                            {cart.length > 0 && <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">{cart.reduce((a, b) => a + b.qty, 0)}</span>}
                        </button>
                    </div>

                    <div className="w-full max-w-7xl mx-auto px-6 mt-8 flex justify-center">
                        <button onClick={() => setView('checkout')} disabled={cart.length === 0} className={`px-12 py-5 rounded-full font-bold text-lg shadow-2xl transition-transform ${cart.length === 0 ? 'bg-[#111] text-gray-500 cursor-not-allowed opacity-50' : 'bg-[#6366f1] text-white hover:bg-indigo-500 hover:scale-[1.02]'}`}>
                            Proceed to Checkout
                        </button>
                    </div>
                </section>
            )}

            {/* --- DRAWER --- */}
            <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setDrawerOpen(false)}></div>

                <div className={`absolute inset-0 flex flex-col transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-5xl mx-auto px-6 pt-10 pb-4 w-full flex justify-between items-center relative z-20">
                        <h2 className="text-xl font-bold text-gray-400 w-full text-center tracking-widest uppercase">
                            {activeProductId ? PRODUCTS.find(p => p.id === activeProductId).name : ''}
                        </h2>
                        <button onClick={() => setDrawerOpen(false)} className="absolute right-6 p-2 bg-[#111] text-white hover:bg-[#222] rounded-full transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div ref={drawerScrollRef} onScroll={handleDrawerScroll} className="flex-1 w-full overflow-x-auto overflow-y-hidden flex items-start gap-6 px-6 pb-20 snap-x snap-mandatory scrollbar-hide">
                        {PRODUCTS.map(p => {
                            const currentQty = getDrawerQty(p.id);
                            return (
                                <div key={p.id} className="flex-shrink-0 w-[85vw] md:w-96 h-full snap-start pt-4 pb-4">
                                    <div className="w-full max-h-full overflow-y-auto bg-[#0a0a0a] border border-[#222] rounded-[2.5rem] p-8 md:p-6 shadow-2xl flex flex-col items-center relative">

                                        <h3 className="text-3xl md:text-2xl font-black text-white mb-1 text-center">{p.name}</h3>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-6 md:mb-4">{p.subtitle}</p>

                                        <div className="bg-black/30 px-6 py-2 rounded-full border border-white/5 mb-8 md:mb-5">
                                            <span className="text-2xl md:text-xl font-bold text-indigo-400">Rs. {p.price}</span>
                                        </div>

                                        <div className="flex items-center gap-3 mb-8 md:mb-5 w-full">
                                            <button onClick={() => changeDrawerQty(p.id, -1, p.maxQty)} disabled={currentQty <= 1} className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-xl hover:bg-[#222] transition disabled:opacity-30">-</button>
                                            <button onClick={() => addToCart(p, currentQty)} className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:scale-[1.02] transition shadow-lg text-sm">
                                                Add {currentQty} to Bag
                                            </button>
                                            <button onClick={() => changeDrawerQty(p.id, 1, p.maxQty)} disabled={currentQty >= p.maxQty} className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-xl hover:bg-[#222] transition disabled:opacity-30">+</button>
                                        </div>

                                        <div className="relative w-full h-96 md:h-64 shrink-0 rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-5 border border-white/5">
                                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized />
                                        </div>

                                        <div className="w-full border-t border-[#222] pt-8 text-left space-y-8">
                                            <div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Overview</h3>
                                                <p className="text-gray-400 leading-relaxed text-sm">{p.longDesc}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">In the Box</h3>
                                                <ul className="space-y-3 text-gray-400 text-sm">
                                                    {p.inTheBox.map(i => <li key={i} className="flex gap-3"><span className="text-indigo-500">✓</span> {i}</li>)}
                                                </ul>
                                            </div>

                                            <div className="border-t border-[#222] pt-8">
                                                <div className="flex items-center gap-3 w-full">
                                                    <button onClick={() => changeDrawerQty(p.id, -1, p.maxQty)} disabled={currentQty <= 1} className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-xl hover:bg-[#222] transition disabled:opacity-30">-</button>
                                                    <button onClick={() => addToCart(p, currentQty)} className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:scale-[1.02] transition shadow-lg text-sm">
                                                        Add {currentQty} to Bag
                                                    </button>
                                                    <button onClick={() => changeDrawerQty(p.id, 1, p.maxQty)} disabled={currentQty >= p.maxQty} className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center text-xl hover:bg-[#222] transition disabled:opacity-30">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex-shrink-0 w-[5vw]"></div>
                    </div>
                </div>
            </div>

            {/* --- MINI CART --- */}
            {isMiniCartOpen && (
                <div className="fixed inset-0 z-[120] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMiniCartOpen(false)}></div>
                    <div className="relative w-full max-w-sm bg-[#0a0a0a] h-full border-l border-[#222] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
                            <h3 className="text-xl font-bold">Your Bag</h3>
                            <button onClick={() => setMiniCartOpen(false)} className="p-2 hover:bg-[#111] rounded-full transition">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-gray-500"><p>Your bag is empty.</p></div> : cart.map(item => (
                                <div key={item.id} className="bg-[#111] p-4 rounded-2xl border border-[#222] flex items-center gap-3">
                                    <div className="pr-2 flex-1">
                                        <div className="font-bold text-white text-sm">{item.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">Rs. {item.price} x {item.qty}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-indigo-400 text-sm">Rs. {(item.price * item.qty).toLocaleString()}</span>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white text-xs hover:bg-[#222]">-</button>
                                            <button onClick={() => updateCartQty(item.id, 1)} className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white text-xs hover:bg-[#222]">+</button>
                                            <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-900/20 rounded-full transition ml-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-[#222] bg-[#0a0a0a]">
                            <div className="flex justify-between text-xl font-bold mb-6"><span>Total</span><span>Rs. {itemsTotal.toLocaleString()}</span></div>
                            <button onClick={() => { setMiniCartOpen(false); setView('checkout'); }} className="w-full py-4 bg-indigo-600 rounded-full font-bold text-white shadow-lg hover:bg-indigo-500 transition">Checkout</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW 2: CHECKOUT (FULL FIDELITY) --- */}
            {view === 'checkout' && (
                <section className="max-w-4xl mx-auto px-6 py-12 pb-32 animate-in fade-in duration-500">
                    <button onClick={() => setView('store')} className="text-indigo-400 text-sm hover:text-indigo-300 mb-6 inline-flex items-center gap-2 font-medium">
                        &larr; Return to Store
                    </button>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end mb-10">
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">Checkout</h1>
                        <p className="text-gray-400 pb-1">Complete your order to secure your limited edition copy.</p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: FORMS */}
                        <div className="md:col-span-7 space-y-8">

                            {/* 1. CART ITEMS */}
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-[2rem] p-8 shadow-xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    Your Items
                                </h2>
                                <div className="space-y-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-[#222]">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                                    <Image src={PRODUCTS.find(p => p.id === item.id).images[0]} alt={item.name} fill className="object-cover" unoptimized />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">Rs. {item.price} x {item.qty}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white text-xs hover:bg-[#222]">-</button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                                    <button onClick={() => updateCartQty(item.id, 1)} className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white text-xs hover:bg-[#222]">+</button>
                                                </div>
                                                <p className="font-bold text-white text-sm whitespace-nowrap">Rs. {(item.price * item.qty).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. SHIPPING DETAILS */}
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-[2rem] p-8 shadow-xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    Shipping Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <input id="name" autoComplete="name" placeholder="Full Name" className={getInputClass('name')} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input id="phone" autoComplete="tel" placeholder="Active Contact" className={getInputClass('phone')} type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <input id="altPhone" autoComplete="tel" placeholder="Alternative Contact" className={getInputClass('altPhone')} type="tel" value={formData.altPhone} onChange={e => handleInputChange('altPhone', e.target.value)} />
                                            {errors.altPhone && <p className="text-red-500 text-xs mt-1 ml-2">{errors.altPhone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <input id="email" autoComplete="email" placeholder="Email Address" className={getInputClass('email')} type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <input id="address" autoComplete="street-address" placeholder="Full Address (House, Street, Area)" className={getInputClass('address')} value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
                                        {errors.address && <p className="text-red-500 text-xs mt-1 ml-2">{errors.address}</p>}
                                    </div>

                                    <div id="landmark" className={`group flex items-center bg-[#111] border rounded-xl px-4 py-2.5 focus-within:border-indigo-500 transition h-[46px] md:h-[50px] ${errors.landmark ? 'border-red-500' : 'border-[#222]'}`}>
                                        <span className="text-gray-400 mr-2 select-none shrink-0 group-focus-within:text-white transition-colors duration-300 text-sm md:text-base">Near to</span>
                                        <input
                                            autoComplete="off"
                                            className="bg-transparent border-none outline-none text-white w-full p-0 placeholder-gray-400 focus:ring-0 text-sm md:text-base"
                                            placeholder="(Landmark)"
                                            value={formData.landmark.replace('Near to ', '')}
                                            onChange={e => handleInputChange('landmark', 'Near to ' + e.target.value)}
                                        />
                                    </div>
                                    {errors.landmark && <p className="text-red-500 text-xs mt-1 ml-2">{errors.landmark}</p>}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input id="city" autoComplete="address-level2" placeholder="City" className={getInputClass('city')} value={formData.city} onChange={e => handleInputChange('city', e.target.value)} />
                                            {errors.city && <p className="text-red-500 text-xs mt-1 ml-2">{errors.city}</p>}
                                        </div>
                                        <input placeholder="Postal Code (Optional)" autoComplete="postal-code" className={getInputClass('postalCode')} value={formData.postalCode} onChange={e => handleInputChange('postalCode', e.target.value)} />
                                    </div>

                                    <textarea placeholder="Order Notes (Optional)" className={`${getInputClass('notes')} h-24 resize-none`} value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)}></textarea>
                                </div>
                            </div>

                            {/* 3. SHIPPING SERVICE */}
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-[2rem] p-8 shadow-xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                    Delivery Method
                                </h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${shippingService === 'standard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#222] bg-[#111] hover:border-[#333]'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="ship" checked={shippingService === 'standard'} onChange={() => setShippingService('standard')} className="accent-indigo-500 w-5 h-5" />
                                            <div>
                                                <p className="font-bold text-white">Standard Shipping</p>
                                                <p className="text-xs text-gray-400">5-7 Working Days</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-300">Rs. {SHIPPING_COSTS.standard}</span>
                                    </label>

                                    <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${shippingService === 'express' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[#222] bg-[#111] hover:border-[#333]'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="ship" checked={shippingService === 'express'} onChange={() => setShippingService('express')} className="accent-indigo-500 w-5 h-5" />
                                            <div>
                                                <p className="font-bold text-white">Express Shipping</p>
                                                <p className="text-xs text-gray-400">1-2 Working Days (TCS)</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-300">Rs. {SHIPPING_COSTS.express}</span>
                                    </label>
                                </div>
                            </div>

                            {/* 4. PREFERENCES & PAYMENT */}
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-[2rem] p-8 shadow-xl">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                    Preferences
                                </h2>

                                {/* Edition Selection */}
                                <div className="mb-8">
                                    <p className="font-bold text-sm text-gray-400 uppercase mb-3 ml-1">Select Edition</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`p-4 rounded-xl border text-center cursor-pointer transition ${editionType === 'simple' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-[#222] bg-[#111] text-gray-400'}`}>
                                            <input type="radio" name="edition" value="simple" checked={editionType === 'simple'} onChange={() => setEditionType('simple')} className="hidden" />
                                            <span className="font-bold">Simple Copy</span>
                                        </label>
                                        <label className={`p-4 rounded-xl border text-center cursor-pointer transition ${editionType === 'signed' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-[#222] bg-[#111] text-gray-400'}`}>
                                            <input type="radio" name="edition" value="signed" checked={editionType === 'signed'} onChange={() => setEditionType('signed')} className="hidden" />
                                            <span className="font-bold block">Signed Copy</span>
                                            <span className="text-[10px] text-indigo-400 block mt-1">(Pre-payment Only)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Signature Logic */}
                                {editionType === 'signed' && (
                                    <div className="mb-8 p-6 bg-[#111] rounded-2xl border-l-4 border-indigo-500 animate-in fade-in slide-in-from-top-4">
                                        <h3 className="font-bold text-white mb-4">Signature Details</h3>
                                        <input id="sigName" placeholder="Sign for (Name)" className={`${getInputClass('sigName')} mb-3`} value={signatureData.name} onChange={e => setSignatureData({ ...signatureData, name: e.target.value })} />
                                        {errors.sigName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.sigName}</p>}

                                        <select className={`${getInputClass('sigLine')} mb-3`} value={signatureData.line} onChange={e => setSignatureData({ ...signatureData, line: e.target.value })}>
                                            <option value="">Select a couplet (Optional)...</option>
                                            <option value="DKZ L1">Dil-e-Khwabzad (Opening Line)</option>
                                            <option value="DN L1">Dard-e-Nayab (Opening Line)</option>
                                            <option value="other">Custom Line...</option>
                                        </select>
                                        {signatureData.line === 'other' && (
                                            <>
                                                <input id="sigCustom" placeholder="Enter custom text (Max 10 words)" className={getInputClass('sigCustom')} value={signatureData.custom} onChange={e => setSignatureData({ ...signatureData, custom: e.target.value })} />
                                                {errors.sigCustom && <p className="text-red-500 text-xs mt-1 ml-2">{errors.sigCustom}</p>}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div>
                                    <p className="font-bold text-sm text-gray-400 uppercase mb-3 ml-1">Payment Method</p>
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-3 p-4 border rounded-xl bg-[#111] ${editionType === 'signed' ? 'opacity-40 cursor-not-allowed border-[#222]' : 'cursor-pointer border-[#222] hover:border-white/20'}`}>
                                            <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => editionType !== 'signed' && setPaymentMethod('cod')} disabled={editionType === 'signed'} className="accent-indigo-500 w-5 h-5" />
                                            <div className="flex-1">
                                                <span className="font-bold text-gray-300">Cash on Delivery (COD)</span>
                                                <span className="text-xs text-gray-400 block mt-1">Ships on 1st January 2026</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer bg-[#111] ${paymentMethod === 'prepayment' ? 'border-indigo-500' : 'border-[#222] hover:border-white/20'}`}>
                                            <input type="radio" name="payment" checked={paymentMethod === 'prepayment'} onChange={() => setPaymentMethod('prepayment')} className="accent-indigo-500 w-5 h-5" />
                                            <div className="flex-1">
                                                <span className="font-bold text-gray-300">Pre-payment / Bank Transfer</span>
                                                <span className="text-xs text-green-500 block mt-1">Ships Immediately + Saves Rs. 300</span>
                                            </div>
                                        </label>

                                        {/* Gateway Selection */}
                                        {paymentMethod === 'prepayment' && (
                                            <div className="ml-8 grid grid-cols-2 gap-3 mt-2 animate-in fade-in">
                                                {['Bank Alfalah', 'Jazzcash', 'Easypaisa', 'SadaPay'].map(g => (
                                                    <label key={g} className={`p-3 rounded-lg border text-sm cursor-pointer text-center transition ${gateway === g ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[#0a0a0a] text-gray-500 border-[#222] hover:bg-[#222]'}`}>
                                                        <input type="radio" name="gateway" value={g} onChange={() => setGateway(g)} className="hidden" />
                                                        {g}
                                                    </label>
                                                ))}
                                                <p className="text-[10px] text-indigo-400/80 col-span-2 text-center mt-2 animate-in fade-in">
                                                    Transfer details will be shown after order placement
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SUMMARY */}
                        <div className="md:col-span-5">
                            <div className="bg-[#0a0a0a] border border-[#222] rounded-[2rem] p-8 shadow-2xl sticky top-8">
                                <h2 className="text-2xl font-black mb-6">Total</h2>

                                {/* Discount Input */}
                                <div className="mb-6 border-b border-white/5 pb-6">
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Discount Code"
                                            className="bg-[#111] border border-[#222] rounded-xl px-4 py-2.5 w-full text-base focus:outline-none focus:border-indigo-500 transition text-white placeholder:text-gray-400"
                                            value={couponCode}
                                            onChange={e => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponStatus(null);
                                            }}
                                        />
                                        <button onClick={applyCoupon} className="bg-[#222] hover:bg-[#333] text-white font-bold px-4 py-2 rounded-xl text-sm transition border border-[#222]">Apply</button>
                                    </div>
                                    {couponStatus && (
                                        <p className={`text-xs mt-2 ml-1 ${couponStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                            {couponStatus.msg}
                                        </p>
                                    )}
                                </div>

                                {/* Calculations */}
                                <div className="space-y-3 text-sm pt-2 mb-6">
                                    <div className="flex justify-between text-gray-400"><span>Item Total</span><span>Rs. {itemsTotal.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping ({shippingService})</span>
                                        <span>{shipping === 0 ? <span className="text-green-500">FREE</span> : `Rs. ${shipping}`}</span>
                                    </div>

                                    {hasDiscounts && (
                                        <>
                                            <div className="border-t border-dashed border-white/20 my-4"></div>
                                            <div className="flex justify-between text-gray-300 font-bold mb-2"><span>Subtotal</span><span>Rs. {grossTotal.toLocaleString()}</span></div>

                                            {codeDiscountAmount > 0 && (
                                                <div className="flex justify-between text-green-500 font-medium"><span>Code Discount</span><span>- Rs. {codeDiscountAmount.toLocaleString()}</span></div>
                                            )}
                                            {prepayDiscountAmount > 0 && (
                                                <div className="flex justify-between text-green-500 font-medium"><span>PrePay Saving</span><span>- Rs. {prepayDiscountAmount.toLocaleString()}</span></div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-end border-t border-white/10 pt-6 mb-8">
                                    <span className="text-gray-400 font-bold">Total to Pay</span>
                                    <span className="text-3xl font-black text-indigo-400 tracking-tight">Rs. {total.toLocaleString()}</span>
                                </div>

                                {/* SUBMIT BUTTON WITH LOADING */}
                                <button onClick={validateAndOrder} disabled={isProcessing} className="w-full py-4 bg-indigo-600 rounded-xl font-bold text-white shadow-lg hover:bg-indigo-500 hover:scale-[1.02] transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isProcessing ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        paymentMethod === 'cod' ? 'Complete Order' : 'Proceed to Payment'
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    Secure checkout powered by WhatsApp. No card info stored.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- VIEW 3: SUCCESS (WhatsApp Share) --- */}
            {view === 'success' && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] rounded-[2.5rem] shadow-2xl relative flex flex-col h-[85vh] max-h-[750px] overflow-hidden no-print">

                        {/* TITLE BAR (For Mobile Receipt Context) */}
                        <div className="p-4 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
                            <span className="font-bold text-white">Order Receipt</span>
                            <button onClick={savePDF} className="text-xs bg-[#222] px-3 py-1.5 rounded-full text-white hover:bg-[#333] flex items-center gap-2 transition">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Save Receipt
                            </button>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto p-8 pb-32 custom-scrollbar">
                            {/* SOLID ANIMATED TICK */}
                            <div className="flex justify-center mb-6">
                                <div className="relative w-20 h-20 flex items-center justify-center bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-scale-in">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-white mb-2 text-center">Thank you, {firstName}!</h2>
                            <p className="text-gray-400 mb-8 text-center leading-relaxed text-sm">
                                Your order has been placed. {paymentMethod === 'prepayment'
                                    ? 'Please complete the transfer below to finalize your booking.'
                                    : 'Please confirm your details via WhatsApp to ensure timely delivery.'}
                            </p>

                            {/* Order ID & Status Badges */}
                            <div className="text-center mb-8">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Number</p>
                                <p className="text-3xl font-mono text-indigo-400 tracking-widest mb-4">#{orderId}</p>

                                {/* BADGES SWAPPED */}
                                <div className="flex justify-center gap-3">
                                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold rounded-full">
                                        Order: Received
                                    </span>
                                    <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full">
                                        Payment: Pending
                                    </span>
                                </div>
                            </div>

                            {/* DYNAMIC Payment Details (Only for Pre-payment) */}
                            {paymentMethod === 'prepayment' && selectedAccount && (
                                <div className="bg-[#111] p-6 rounded-2xl mb-8 border border-[#222] text-left relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-bl-full"></div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Transfer Details ({gateway})</p>
                                    <div className="space-y-1">
                                        <p className="text-white font-bold text-lg">{selectedAccount.title}</p>
                                        <p className="text-gray-300 font-mono text-xl tracking-wide">{selectedAccount.number}</p>
                                        <p className="text-xs text-indigo-400 mt-2 font-medium">{selectedAccount.label}</p>
                                    </div>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="space-y-4 border-t border-[#222] pt-8">
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest">Order Summary</h3>
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-10 relative rounded overflow-hidden opacity-80 border border-[#333]">
                                                <Image src={PRODUCTS.find(p => p.id === item.id).images[0]} alt="cover" fill className="object-cover" unoptimized />
                                            </div>
                                            <div>
                                                <p className="text-gray-300 font-medium">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                        </div>
                                        <span className="text-gray-400 font-mono">Rs. {(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}

                                <div className="border-t border-[#222] my-4"></div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping To</span>
                                    <span className="text-white text-right w-1/2 text-xs leading-relaxed truncate">{formData.address}</span>
                                </div>

                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-gray-400 font-bold">Total Amount</span>
                                    <span className="text-2xl font-black text-white">Rs. {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* STICKY FOOTER BUTTON (Hidden on Print) */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-[#0a0a0a] border-t border-[#222] no-print">
                            <p className="text-xs text-gray-500 mb-2 text-center">
                                {paymentMethod === 'prepayment' ? 'Transferred the amount?' : 'Ready to confirm?'}
                            </p>
                            <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.05] flex items-center justify-center gap-3 active:scale-95">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                {paymentMethod === 'prepayment' ? 'Send Screenshot' : 'Confirm via WhatsApp'}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}