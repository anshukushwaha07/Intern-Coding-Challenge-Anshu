import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FaStore, FaBars, FaTimes } from "react-icons/fa";
import AdminDropdown from './AdminDropdown.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
  };

  const getLinkClassName = ({ isActive }) =>
    `transition-colors duration-300 ${isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`;

  const getMobileLinkClassName = ({ isActive }) => 
    `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <nav className="sticky top-4 mx-4 sm:mx-6 lg:mx-8 z-50 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeAllMenus}>
              <FaStore className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">StoreRating</span>
            </NavLink>
            {/* THIS IS THE CORRECTED LINE */}
            <div className="hidden md:flex md:ml-10 md:space-x-8 font-semibold items-center">
              <NavLink to="/" className={getLinkClassName}>Stores</NavLink>
              {user && user.role === "owner" && (
                <NavLink to="/owner" className={getLinkClassName}>My Dashboard</NavLink>
              )}
              <AdminDropdown user={user} closeAllMenus={closeAllMenus} />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <NavLink to="/login" className="font-semibold text-gray-700 hover:text-blue-600">Login</NavLink>
                <NavLink to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-md">Sign Up</NavLink>
              </>
            ) : (
              <>
                <span className="text-gray-700">Hello, <span className="font-bold">{user.name}</span></span>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-all shadow-md">Logout</button>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={getMobileLinkClassName} onClick={closeAllMenus}>Stores</NavLink>
            {user && user.role === "owner" && (
              <NavLink to="/owner" className={getMobileLinkClassName} onClick={closeAllMenus}>My Dashboard</NavLink>
            )}
            {user && user.role === "admin" && (
              <div className="border-t border-gray-200/50 mt-2 pt-2">
                 <p className="px-3 pt-1 pb-2 text-xs font-semibold text-gray-400 uppercase">Admin Tools</p>
                 <NavLink to="/admin" className={getMobileLinkClassName} onClick={closeAllMenus}>Dashboard</NavLink>
                 <NavLink to="/admin/add-user" className={getMobileLinkClassName} onClick={closeAllMenus}>Add User</NavLink>
                 <NavLink to="/admin/add-store" className={getMobileLinkClassName} onClick={closeAllMenus}>Add Store</NavLink>
              </div>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200/50">
            {!user ? (
              <div className="flex items-center justify-center px-5 gap-4">
                <NavLink to="/login" className="flex-1 text-center font-medium text-gray-600 hover:text-blue-500" onClick={closeAllMenus}>Login</NavLink>
                <NavLink to="/signup" className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700" onClick={closeAllMenus}>Sign Up</NavLink>
              </div>
            ) : (
              <div className="px-5">
                <p className="text-base font-medium text-gray-800">Hello, {user.name}</p>
                <button onClick={handleLogout} className="w-full mt-2 text-center bg-red-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}