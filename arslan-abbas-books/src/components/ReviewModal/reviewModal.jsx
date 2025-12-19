import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ReviewModal.css";

const ReviewModal = ({ close }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        setError("");

        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        try {
            setLoading(true);

            const url = `${BASE_URL} + /admin/login`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Optional: store token
            localStorage.setItem("adminToken", data.token);

            // Close modal
            close();

            // Redirect to Admin Panel
            window.location.href = "/admin";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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



                {error && <p className="error-text">{error}</p>}

                <button className="login-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
