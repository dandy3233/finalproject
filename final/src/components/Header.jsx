import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faSignOutAlt, faUsers, faBox, faClipboardList } from "@fortawesome/free-solid-svg-icons";


function Header() {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  console.log(userInfo); // Debugging: Check if userInfo exists

  return (
    <>
      {/* Top Contact Info Bar */}
      <div className="bg-green-600 text-white p-2">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div className="flex space-x-6 text-sm">
          <p className="flex items-center gap-2">
              📞 01734360072
            </p>
            <p className="flex items-center gap-2">
              ✉️ dandytakilu@gmail.com
            </p>
          </div>

          {/* Profile, Register, and Admin Section */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="relative group">
                {/* User Name */}
                <button className="hover:text-gray-200 transition">
                <FontAwesomeIcon icon={faUser} /> {userInfo.name}
                  </button>

                {/* Dropdown */}
                <div className="absolute top-full [left:-10vh] hidden group-hover:block bg-white shadow-lg rounded-md mt-1 w-40 border border-gray-200 z-50">
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

           {/* Admin Dropdown with Profile & Logout */}
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

      {/* Main Navbar */}
      <nav className="bg-white/70 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center max-w-screen-xl mx-auto">
      <Link 
    to="/" 
    className="text-4xl font-extrabold tracking-wider font-african
              hover:scale-105 transition-transform duration-200"
>
    African <span className="animate-pulse">Fashion</span>
</Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-lg ">
          <Link to="/" className="hover:text-green-500 transition">Home</Link>
          <Link to="/catalog" className="hover:text-green-500 transition">Catalog</Link>
          <Link to="/about" className="hover:text-green-500 transition">About Us</Link>
          <Link to="/contact" className="hover:text-green-500 transition">Contact</Link>
        </div>

        {/* Icons Section */}
        <div className="flex items-center space-x-6 text-lg">
          <Link to="/search" className="hover:text-green-500 transition">
            <i className="fa fa-search"></i>
          </Link>
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
    </>
  );
}

export default Header;
