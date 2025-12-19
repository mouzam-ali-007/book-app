import { useState } from "react";
import "./excitement.css";
import { BASE_URL } from "../../utilities/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        setError("");
        setLoading(true); // start loading immediately

        try {
            const url = `${BASE_URL}api/submitReview`;

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    role,
                    description: message,
                    icons: "⭐"
                })
            });


            const data = await res.json();

            toast.success("Review Added Successfully");

            // clear form
            setName("");
            setRole("");
            setMessage("");

            // optionally close modal after submission
            // close();

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false); // stop loading in finally
        }
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                pauseOnHover
                closeOnClick
            />

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

                    {error && <p className="error-text">{error}</p>}

                    <button
                        className="login-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit My Comment"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ExcitementModal;
