import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";
import "./Nav.css";

const Navbar = () => {
    const navigate = useNavigate();
    const { toggleBag, totalCount } = useCart();
    const [open, setOpen] = useState(false);



    const handleStoreClick = () => {
        navigate("/store");
    };

    const handleAboutClick = () => {
        navigate("/about");
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="nav-logo">Arslan Abbas</div>

            {/* Desktop Menu */}
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li onClick={handleStoreClick}><a>Store</a></li>

                <li onClick={handleAboutClick}><a>About</a></li>
                <li><a href="/">Contact</a></li>
            </ul>


            {/* <button className="preorder transition duration-200" onClick={handlePreOrderClick}>

                Pre-Order Now

            </button> */}

            {/* Mobile Icon */}
            <div className="nav-toggle" onClick={() => setOpen(!open)}>
                <span className={open ? "bar bar1-open" : "bar"}></span>
                <span className={open ? "bar bar2-open" : "bar"}></span>
                <span className={open ? "bar bar3-open" : "bar"}></span>
            </div>



            {/* Mobile Menu */}
            <div className={`mobile-menu ${open ? "open" : ""}`}>
                <a onClick={() => setOpen(false)} >Home</a>
                <a onClick={handleStoreClick} >Store</a>

                <a onClick={handleAboutClick} >About</a>
                <a onClick={() => setOpen(false)} >Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
