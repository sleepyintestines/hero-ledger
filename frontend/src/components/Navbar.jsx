import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/provider";

export default function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <nav style={{
            backgroundColor: "#333",
            padding: "15px 30px",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
            color: "white"
        }}>
            {user && (
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span style={{ fontSize: "14px" }}>
                        {user.email}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
