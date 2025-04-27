import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import Categories from "./Categories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faTruck,
  faSignOutAlt, 
  faUsers, 
  faBox, 
  faClipboardList,
  faSearch,
  faUserCircle, 
  faSignInAlt,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const wishlist = useSelector((state) => state.wishlist || { wishlistItems: [] });
  const { wishlistItems } = wishlist;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => dispatch(logout());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-green-600 text-white p-1.5 sm:p-2 fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
{/* Logo & Categories Dropdown */}
<div className="relative group">
  <div className="text-4xl font-extrabold tracking-wider font-african hover:scale-105 transition-transform duration-200 flex items-center space-x-2 cursor-pointer">
    <span className="animate-pulse">🌟</span>
    {/* <img
              className="absolute z-20 lg:top-[23rem] sm:top-[20.5rem] top-[10.5rem] left-[2rem] lg:w-[8rem] lg:h-[8rem] sm:w-[6rem] sm:h-[6rem] w-[3rem] h-[3rem] rounded-full"
              src="/images/about/4.png"  // Updated path
              alt="Side Image 3"
            /> */}
    {/* <span className="hover:text-green-500 transition">All Categories</span> */}
  </div>

  {/* Dropdown stays visible while hovering over it */}
  <div className="absolute top-full text-green-500 left-0 hidden group-hover:block bg-white shadow-lg rounded-md mt-1 w-64 border border-gray-200 z-[100] p-2">
    <Categories />
  </div>
</div>



          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 text-lg">
            <Link to="/" className="hover:text-green-500 transition">Home</Link>
            <Link to="/CategoryScreen" className="hover:text-green-500 transition">Catalog</Link>
            <Link to="/about" className="hover:text-green-500 transition">About Us</Link>
            <Link to="/contact" className="hover:text-green-500 transition">Contact</Link>
          </div>

          {/* Search Bar */}
          <div className={`relative ${isSearchFocused ? 'w-96' : 'w-64'} transition-all duration-300 mr-4`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder={isSearchFocused ? "Search your product ↵" : "Search.."}
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full outline-none transition-all duration-300"
                style={{ borderColor: isSearchFocused ? '#3B82F6' : '#D1D5DB' }}
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                  isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>

          {/* Wishlist & Cart Icons */}
          <div className="flex items-center space-x-6 backdrop-blur-sm px-4 py-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <Link to="/wishlist" className="p-2 text-gray-700 hover:text-pink-500 transition-all relative group">
              <i className="fa fa-heart text-xl"></i>
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 transform scale-0 group-hover:scale-100 transition-transform">
                {wishlistItems.length}
              </span>
            </Link>
            <Link to="/cart" className="p-2 text-gray-700 hover:text-green-700 transition-all relative group">
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartItems.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 transform scale-100 group-hover:scale-110 transition-transform">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4 relative">
            <div className="relative group">
              <button 
                className="p-2 hover:bg-white/20 rounded-full transition-all"
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                <FontAwesomeIcon 
                  icon={faUserCircle} 
                  className="w-6 h-6 text-white hover:text-green-300 transition-colors"
                />
                {userInfo?.isAdmin && (
                  <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 w-2.5 h-2.5 rounded-full border border-white"></span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg ring-1 ring-black/5 py-2 z-50"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {userInfo ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
                        <p className="text-xs text-gray-500">{userInfo.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3 text-green-500" />
                          Profile
                        </Link>
                        {userInfo.isAdmin && (
                          <>
                            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Admin</div>
                            <Link
                              to="/admin/userlist"
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-3 text-blue-500" />
                              Users
                            </Link>
                            <Link
                              to="/admin/productlist"
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faBox} className="w-4 h-4 mr-3 text-purple-500" />
                              Products
                            </Link>
                            <Link
                              to="/admin/orderlist"
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4 mr-3 text-orange-500" />
                              Orders
                            </Link>

                            <Link
                              to="/admin/DeliveryManager"
                              className="flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faTruck} className="w-4 h-4 mr-3 text-orange-500" />
                              DeliveryManager
                            </Link>


                            
                          </>
                        )}
                      </div>
                      <div className="p-2 pt-1 border-t border-gray-100">
                        <button
                          onClick={logoutHandler}
                          className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <Link
                        to="/login"
                        className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 mr-2" />
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     

      {/* Spacer */}
      <div className="pt-40 sm:pt-28"></div>
    </>
  );
}

export default Header;