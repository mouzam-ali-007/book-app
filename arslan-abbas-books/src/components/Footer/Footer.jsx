import { useState } from "react";
import Social from "../SocialStrip/social";
import "./Footer.css";
import ReviewModal from "../ReviewModal/reviewModal";

const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <footer className="footer">
                <div className="footer-container">

                    <h2 className="footer-title">Arslan Abbas</h2>

                    <div className="footer-grid">

                        <div className="footer-column">
                            <h4>Navigation</h4>
                            <a href="#">Home</a>
                            <a href="#">Shop</a>
                            <a href="#">About</a>
                            <a href="#">Contact</a>
                        </div>

                        <div className="footer-column">
                            <h4>Books</h4>
                            <a className="highlight" href="#">Musafirat (New)</a>
                            <a href="#">Dil-e-Khwabzad</a>
                            <a href="#">Dard-e-Nayab</a>
                            <a href="#">All Editions</a>
                        </div>

                        <div className="footer-column">
                            <h4>Legal & Press</h4>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Media / Press</a>
                        </div>



                    </div>
                    <Social />

                    <div className="review-comments" onClick={() => setIsModalOpen(true)}>
                        <a>Comments Review Panel.</a>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2025 Arslan Abbas. All rights reserved.</p>
                    </div>

                </div>
            </footer>

            {/* Modal */}
            {isModalOpen && <ReviewModal close={() => setIsModalOpen(false)} />}

        </>
    );
};

export default Footer;
