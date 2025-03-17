import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import Categories from "./Categories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faLock, 
  faSignOutAlt, 
  faUsers, 
  faBox, 
  faClipboardList,
  faSearch 
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const navigate = useNavigate(); // Initialize navigate hook

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  // Search handler function
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to the search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear search input after submission
    }
  };

  return (
    <>
      {/* Sticky Top Contact Info Bar */}
      <div className="bg-green-600 text-white p-1.5 sm:p-2 fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <Link 
            to="/" 
            className="text-4xl font-extrabold tracking-wider font-african hover:scale-105 transition-transform duration-200"
          >
            African <span className="animate-pulse">Star 🌟</span>
          </Link>

          <div className="hidden sm:flex space-x-6 text-sm">
            <p className="flex items-center gap-2">📞 01734360072</p>
            <p className="flex items-center gap-2">✉️ dandytakilu@gmail.com</p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-lg w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex items-center w-full sm:w-64 lg:w-96">
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="px-4 py-2 border rounded-md text-sm w-full sm:w-64 lg:w-96 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 shadow-md placeholder-gray-400 hover:ring-2 hover:ring-green-300 text-gray-700 block"
              />
              <button
                type="submit"
                className="ml-3 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
              >
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="ml-3 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  ✖
                </button>
              )}
            </form>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="relative group">
                <button className="hover:text-gray-200 transition">
                  <FontAwesomeIcon icon={faUser} /> {userInfo.name}
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-1 w-40 border border-gray-200 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/register" className="hover:text-gray-200 transition">
                  <FontAwesomeIcon icon={faUser} /> Register
                </Link>
                <Link to="/login" className="hover:text-gray-200 transition">
                  <FontAwesomeIcon icon={faLock} /> Login
                </Link>
              </div>
            )}

            {/* Admin Dropdown */}
            {userInfo && userInfo.isAdmin && (
              <div className="relative group">
                <button className="hover:text-gray-200 transition">Admin</button>
                <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-1 w-40 border border-gray-200 z-50">
                  <Link to="/admin/userlist" className="block px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faUsers} /> Users
                  </Link>
                  <Link to="/admin/productlist" className="block px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faBox} /> Products
                  </Link>
                  <Link to="/admin/orderlist" className="block px-4 py-2 text-gray-700 hover:text-green-500 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faClipboardList} /> Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Main Navbar */}
      <nav className="bg-white/70 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center max-w-screen-xl mx-auto fixed left-0 top-14 w-full z-50 mt-14 sm:mt-0">
        {/* Dropdown Categories */}
        <div className="relative">
          <button 
            className="hover:text-green-500 transition" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            All Categories
          </button>
          {dropdownOpen && (
            <div 
              className="absolute top-full left-0 bg-white shadow-lg rounded-md mt-1 w-64 border border-gray-200 z-[100] p-2"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Categories />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-green-500 transition">Home</Link>
          <Link to="/catalog" className="hover:text-green-500 transition">Catalog</Link>
          <Link to="/about" className="hover:text-green-500 transition">About Us</Link>
          <Link to="/contact" className="hover:text-green-500 transition">Contact</Link>
        </div>

        {/* Cart & Icons */}
        <div className="flex items-center space-x-6 text-lg">
          {/* <Link to="/search" className="hover:text-green-500 transition">
            <i className="fa fa-search"></i>
          </Link> */}
          <Link to="/wishlist" className="hover:text-green-500 transition">
            <i className="fa fa-heart"></i>
          </Link>
          <Link to="/cart" className="relative hover:text-green-500 transition">
            <i className="fas fa-shopping-cart"></i>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Spacer for Sticky Elements */}
      <div className="pt-40 sm:pt-28"></div>
    </>
  );
}

export default Header;
