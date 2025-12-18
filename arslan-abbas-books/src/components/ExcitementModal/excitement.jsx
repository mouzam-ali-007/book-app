import { useState } from "react";
import "./excitement.css";

const ExcitementModal = ({ close }) => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        // Example: log the values or send to API
        console.log({ name, role, message });
        // You can also close the modal after submission
        close();
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

                <button className="login-btn" onClick={handleSubmit}>
                    Log In
                </button>
            </div>
        </div>
    );
};

export default ExcitementModal;
