import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUserCircle, FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, isLoggedIn, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-10 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <img src={logo} alt="Vendora" className="h-10" />
        <div>
          <h1 className="font-bold text-xl">
            VEND<span className="text-orange-500">ORA</span>
          </h1>
          <p className="text-xs text-gray-500">Online Store</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        {isLoggedIn && <Link to="/products" className="hover:text-orange-500">Products</Link>}
        <Link to="/categories" className="hover:text-orange-500">Categories</Link>
        <Link to="/offers" className="hover:text-orange-500">Offers</Link>
        <Link to="/contact" className="hover:text-orange-500">Contact</Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-full pl-4 pr-10 py-1.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm w-48 md:w-64 transition-all"
          />
          <button type="submit" className="absolute right-3 text-gray-500 hover:text-orange-500 transition-colors">
            <FaSearch className="text-sm" />
          </button>
        </form>

        {/* Cart */}
        {isLoggedIn && (
          <div className="relative cursor-pointer">
            <Link to="/cart" className="text-gray-700 hover:text-orange-500 relative block">
              <FaShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            {/* Profile Dropdown (Replaces Login) */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <FaUserCircle className="text-2xl" />
                <span className="hidden sm:inline font-medium">{user?.username || 'Profile'}</span>
                <FaChevronDown className={`text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 overflow-hidden">
                  <Link 
                    to="/account" 
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Account
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Orders
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-orange-600 font-bold hover:bg-orange-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Logout Button (Replaces Register) */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 shadow-md transition-all hover:shadow-red-200 font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-orange-500 px-3 py-1.5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 shadow-md transition-all hover:shadow-orange-200"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;