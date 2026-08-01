import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/changePassword.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ChangePassword() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            return setError("Please fill in all fields.");
        }

        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        try {
            setLoading(true);

           const response = await axiosPrivate.patch(
                "/change-password",
                {
                    currentPassword,
                    newPassword,
                },
                {
                    withCredentials: true,
                }
            );

            setSuccess(response.data.message);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
             console.log(err);
    console.log(err.response);
    console.log(err.response?.data);
            setError(
                err.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page">

            <div className="change-password-card">

                <h2>Change Password</h2>

                <p>
                    Choose a new password for your account.
                </p>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="currentPassword">
                        Current Password
                    </label>

                    <div className="password-input">
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() =>
                                setShowCurrentPassword(prev => !prev)
                            }
                        >
                            {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <label htmlFor="newPassword">
                        New Password
                    </label>

                    <div className="password-input">
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() =>
                                setShowNewPassword(prev => !prev)
                            }
                        >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>

                    <div className="password-input">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() =>
                                setShowConfirmPassword(prev => !prev)
                            }
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="form-success">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ChangePassword;