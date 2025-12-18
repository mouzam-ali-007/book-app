import { useState } from "react";
import "./ReviewModal.css";

const ReviewModal = ({ close }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        console.log("Username:", username);
        console.log("Password:", password);
        // Add your login logic here
    };

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={close}>×</button>

                <h2>Review Panel Login</h2>
                <p>Enter credentials for the Comments Review Panel.</p>

                <input
                    type="text"
                    placeholder="Username (Admin)"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <input
                    type="password"
                    placeholder="Password (Jahanzad910)"
                    value={password}
                    onChange={handlePasswordChange}
                />

                <button className="login-btn" onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
};

export default ReviewModal;
