import { useState } from "react";
import "./excitement.css";
import { BASE_URL } from "../../utilities/constants";

const ExcitementModal = ({ close }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async () => {
        if (!name || !role || !message) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const url = `${BASE_URL} + $/api/review`

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    role,
                    description: message
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            // Success → close modal
            close();

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

                <h2>Share Your Excitement</h2>

                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select
                    id="role-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Your Role</option>
                    <option value="Longtime Reader">Longtime Reader</option>
                    <option value="Poetry Observer">Poetry Observer</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Literary Critic">Literary Critic</option>
                    <option value="Aspiring Writer">Aspiring Writer</option>
                    <option value="Student">Student</option>
                    <option value="Journalist">Journalist</option>
                    <option value="Community Member">Community Member</option>
                    <option value="Author">Author</option>
                </select>

                <textarea
                    placeholder="I'm counting down the days for Musafirat"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>

                {error && <p className="error-text">{"Some went wrong"}</p>}
                <button
                    className="login-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <span className="loader"></span> : "Submit My Comment"}
                </button>




            </div>
        </div>
    );
};

export default ExcitementModal;
