import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Rating from './Rating';
import 'animate.css';

function Product({ product }) {
  const navigate = useNavigate();
  const [qty] = useState(1);

  const addToCartHandler = () => {
    navigate(`/cart/${product._id}?qty=${qty}`);
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden animate__animated animate__fadeIn animate__delay-1s animate__faster transform transition-transform duration-300 hover:scale-105 hover:animate__pulse">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-center text-gray-500 mb-2">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 384 512"
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path>
          </svg>
          <p className="text-sm">{product.category}</p>
        </div>
        <Link to={`/product/${product._id}`} className="text-lg font-semibold text-gray-900 hover:text-green-600 truncate block">
          {product.name}
        </Link>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <Rating value={product.rating} color="green" />
            <p className="text-sm text-gray-500">{product.numReviews} reviews</p>
            <p className="text-lg font-bold text-green-600">${product.price}</p>
          </div>
          <button
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-700 transition"
            onClick={addToCartHandler}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
