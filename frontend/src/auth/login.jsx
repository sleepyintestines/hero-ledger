import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate("/");
        }
    };

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
                }}>Login</h2>
                <form onSubmit={handleLogin}>
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
                            onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
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
                            onFocus={(e) => e.target.style.borderColor = "#4CAF50"}
                            onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        />
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={{
                    marginTop: "24px",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px"
                }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{
                        color: "#2196F3",
                        textDecoration: "none",
                        fontWeight: "600"
                    }}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}