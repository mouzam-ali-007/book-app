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
                <li><a href="#home">Home</a></li>
                <li><a href="#books">Books</a></li>
                <li><a href="#order">Order</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
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
