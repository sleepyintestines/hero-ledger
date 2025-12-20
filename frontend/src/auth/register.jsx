import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            // Navigate to main page after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    };

    if (success) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                padding: "20px"
            }}>
                <div style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    padding: "40px",
                    width: "100%",
                    maxWidth: "400px"
                }}>
                    <div style={{
                        padding: "20px",
                        backgroundColor: "#e3f2fd",
                        color: "#1565c0",
                        borderRadius: "6px",
                        textAlign: "center",
                        border: "1px solid #bbdefb"
                    }}>
                        <h3 style={{ margin: "0 0 10px 0" }}>Registration Successful!</h3>
                        <p style={{ margin: "5px 0" }}>Your account has been created.</p>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            padding: "20px"
        }}>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                padding: "40px",
                width: "100%",
                maxWidth: "400px"
            }}>
                <h2 style={{
                    textAlign: "center",
                    color: "#333",
                    marginBottom: "30px",
                    fontSize: "28px",
                    fontWeight: "600"
                }}>Register</h2>
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#555",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="3"
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                boxSizing: "border-box",
                                transition: "border-color 0.3s",
                                outline: "none"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#2196F3"}
                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#555",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                boxSizing: "border-box",
                                transition: "border-color 0.3s",
                                outline: "none"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#2196F3"}
                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#555",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                boxSizing: "border-box",
                                transition: "border-color 0.3s",
                                outline: "none"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#2196F3"}
                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        />
                        <small style={{ color: "#888", fontSize: "12px", marginTop: "4px", display: "block" }}>
                            Password must be at least 6 characters
                        </small>
                    </div>

                    {error && (
                        <div style={{
                            padding: "12px",
                            marginBottom: "20px",
                            backgroundColor: "#fee",
                            color: "#c33",
                            borderRadius: "6px",
                            fontSize: "14px",
                            border: "1px solid #fcc"
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: loading ? "#64B5F6" : "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.3s",
                            marginTop: "10px"
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#1976D2")}
                        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#2196F3")}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p style={{
                    marginTop: "24px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px"
                }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{
                        color: "#2196F3",
                        textDecoration: "none",
                        fontWeight: "600"
                    }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
