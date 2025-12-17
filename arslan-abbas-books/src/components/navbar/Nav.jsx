import React, { useState } from "react";
import "./Nav.css";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const handlePreOrderClick = () => {
        console.log("Pre-Order button clicked");
    }

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="nav-logo">Arslan Abbas</div>

            {/* Desktop Menu */}
            <ul className="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/">Books</a></li>
                <li><a href="/checkout">Order</a></li>
                <li><a href="/">About</a></li>
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
                <a onClick={() => setOpen(false)} href="/">Home</a>
                <a onClick={() => setOpen(false)} href="/">Books</a>
                <a onClick={() => setOpen(false)} href="/checkout">Order</a>
                <a onClick={() => setOpen(false)} href="/">About</a>
                <a onClick={() => setOpen(false)} href="/">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
