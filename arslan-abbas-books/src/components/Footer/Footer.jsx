import "./Footer.css";
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">Email</a>
            </div>

            <p className="footer-copy">© 2025 Arslan Abbas. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
