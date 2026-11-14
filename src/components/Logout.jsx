import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <button onClick={handleLogout} className="text-white hover:text-sky-200">
            Logout
        </button>
    );
}

export default Logout;