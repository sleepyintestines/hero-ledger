import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../auth/login.jsx"
import Register from "../auth/register.jsx"
import Protected from "../components/protected.jsx"
import Navbar from "../components/Navbar.jsx"

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/"
                    element={
                        <Protected>
                            <div>
                                <Navbar />
                                <div style={{ padding: "20px" }}>
                                    <h1>Dashboard</h1>
                                    <p>Yokoso, Travaller.</p>
                                </div>
                            </div>
                        </Protected>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}