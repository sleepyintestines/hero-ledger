import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/provider.jsx"

export default function Protected({ children }){
    const {user, loading} = useAuth();

    if(loading) return <p>Loading...</p>
    if(!user) return <Navigate to="/login" />

    return children;
}