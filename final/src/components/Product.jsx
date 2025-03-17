// src/components/Product.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faFire, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Rating from './Rating';
import 'animate.css';

function Product({ product }) {
  const navigate = useNavigate();
  const { category } = useParams(); // Get the category from the URL
  const [qty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem(`wishlist-${product._id}`);
    if (savedWishlist) {
      setIsWishlisted(JSON.parse(savedWishlist));
    }
  }, [product._id]);

  // src/components/Product.jsx
const toggleWishlist = useCallback(() => {
  setIsWishlisted((prev) => {
    const newState = !prev;
    localStorage.setItem(`wishlist-${product._id}`, JSON.stringify(newState));

    // Update the wishlist array in localStorage
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
    let updatedIds;
    if (newState) {
      updatedIds = [...wishlistIds, product._id];
    } else {
      updatedIds = wishlistIds.filter(id => id !== product._id);
    }
    localStorage.setItem('wishlist', JSON.stringify(updatedIds));

    return newState;
  });
}, [product._id]);

  // ✅ Filter products based on category (if category is selected)
  if (category && product.category.toLowerCase().replace(/\s+/g, '-') !== category) {
    return null; // Hide product if it doesn't match the selected category
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <button
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-50 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist();
        }}
      >
        <FontAwesomeIcon
          icon={isWishlisted ? faHeartSolid : faHeartRegular}
          className={`transition-colors duration-300 ${isWishlisted ? "text-red-500" : "text-gray-500"}`}
        />
      </button>

      {product.discount && (
        <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full absolute top-2 left-2 animate__animated animate__bounceIn">
          -{product.discount}%
        </span>
      )}

      <Link to={`/product/${product._id}`} className="block">
        <img src={product.image} alt={product.name} className="w-full h-40 object-contain mx-auto hover:opacity-90 transition" />
      </Link>

      <div className="p-3">
        {/* Category & Hot Badge */}
        <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
          <Link
            to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-green-500 transition"
          >
            {product.category}
          </Link>
          {product.hot && (
            <span className="text-red-500 flex items-center">
              <FontAwesomeIcon icon={faFire} className="mr-1" /> Hot
            </span>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="block text-sm font-semibold text-gray-900 hover:text-blue-600 truncate">
          {product.name}
        </Link>

        <div className="mt-1">
          <Rating value={product.rating} color="green" />
          <p className="text-xs text-gray-500">{product.numReviews} reviews</p>
        </div>

        <div className="flex items-center space-x-2 mt-1">
          <span className="text-blue-600 text-lg font-semibold">${product.price}</span>
          {product.discount && (
            <span className="text-gray-400 text-xs line-through">
              ${(product.price * (1 + product.discount / 100)).toFixed(2)}
            </span>
          )}

          <button
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-700 transition"
            onClick={() => navigate(`/cart/${product._id}?qty=${qty}`)}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
