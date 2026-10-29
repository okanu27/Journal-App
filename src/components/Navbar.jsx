import { Link } from "react-router-dom";

function Navbar() {
  return (
     <nav className="sticky top-0 left-0 z-50 w-full border-b border-white/10 bg-black backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <h1 className="text-white text-xl font-bold">My Journal</h1>

        <ul className="flex space-x-6">
          <li><Link to="/" className="text-white hover:text-gray-400">Home</Link></li>
          <li><Link to="/about" className="text-white hover:text-gray-400">About</Link></li>
          <li><Link to="/contact" className="text-white hover:text-gray-400">Contact</Link></li>
          <li><Link to="/Compose" className="text-white hover:text-gray-400">POST A JOURNAL</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
