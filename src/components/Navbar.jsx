import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
     <nav className="sticky top-0 left-0 z-50 w-full border-b border-white/10 bg-sky-950 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-white text-xl font-bold">My Journal</h1>

              {/* Destop navigation */}
            <div className="">
              <ul className="hidden items-center gap-5 py-4 md:flex">
                <li><Link to="/" className="text-white hover:text-sky-200">Home</Link></li>
                <li><Link to="/about" className="text-white hover:text-sky-200">About</Link></li>
                <li><Link to="/contact" className="text-white hover:text-sky-200">Contact</Link></li>
                <li><Link to="/Compose" className="text-white hover:text-sky-200">POST A JOURNAL</Link></li>
                <li><button onClick={handleLogout} className="bg-red-600 text-white py-2 p-2 rounded-md font-medium hover:bg-red-700 hover:text-gray-200">
                  Logout
                </button></li>
              </ul>
            </div>

            <button
              type="submit"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              className="md:hidden text-white text-2xl p-2"
              aria-label="Toggle navigation menu">

                {isMenuOpen ? <FiX /> : <FiMenu />}

            </button>
            
        </div>

        {/* Mobile Menu Dropdown Panel */}
        {isMenuOpen && (
          <div className="absolute top-full text-white left-0 w-full bg-sky-950 border-t border-slate-950 border-gray-800 p-4 flex flex-col gap-4 shadow-xl md:hidden">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-900 hover:text-gray-300">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-900 hover:text-gray-300">About</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-900 hover:text-gray-300">Contact</Link>
            <Link 
              to="/compose" 
              onClick={() => setIsMenuOpen(false)} 
              className="bg-sky-950 text-white text-center py-2.5 rounded-md font-medium mt-2 hover:bg-sky-800 hover:text-gray-200"
            >
              Post a Journal
            </Link>
            <button onClick={handleLogout} className="bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 hover:text-gray-200">
              Logout
            </button>
          </div>
        )}

    </nav>
  );
}

export default Navbar;
