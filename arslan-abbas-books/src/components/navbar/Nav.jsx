import React, { useState } from "react";
import "./Nav.css";

const Navbar = () => {
    const [open, setOpen] = useState(false);

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

            {/* Mobile Icon */}
            <div className="nav-toggle" onClick={() => setOpen(!open)}>
                <span className={open ? "bar bar1-open" : "bar"}></span>
                <span className={open ? "bar bar2-open" : "bar"}></span>
                <span className={open ? "bar bar3-open" : "bar"}></span>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${open ? "open" : ""}`}>
                <a onClick={() => setOpen(false)} href="#home">Home</a>
                <a onClick={() => setOpen(false)} href="#books">Books</a>
                <a onClick={() => setOpen(false)} href="#order">Order</a>
                <a onClick={() => setOpen(false)} href="#about">About</a>
                <a onClick={() => setOpen(false)} href="#contact">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
