import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../actions/productActions';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import 'animate.css';

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product = {} } = productDetails; // Ensure product is always an object

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/" className="text-gray-500 hover:text-gray-800 text-sm mb-4 inline-block">
        &larr; Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : product ? ( 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="flex justify-center animate__animated animate__fadeInLeft animate__delay-1s">
            <img
              src={product?.image || '/images/placeholder.png'}
              alt={product?.name || 'Product'}
              className="max-h-96 object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4 animate__animated animate__fadeInRight animate__delay-1s">
            <h2 className="text-3xl font-semibold">{product?.name || 'Unknown Product'}</h2>

            {/* Category Link - Use Optional Chaining */}
            <p className="text-sm text-gray-500">
              Category:
              {product?.category ? (
                <Link 
                  to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-500 hover:underline ml-1"
                >
                  {product.category}
                </Link>
              ) : (
                <span className="text-gray-400">Unknown</span>
              )}
            </p>

            <Rating 
              value={product?.rating || 0} 
              text={`${product?.numReviews || 0} reviews`} 
              color="#f8e825" 
            />
            <p className="text-red-500 text-xl font-bold">Price: ${product?.price || 'N/A'}</p>
            <p className="text-gray-600">{product?.description || 'No description available.'}</p>

            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-700">Price:</span>
                <span className="font-semibold">${product?.price || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700">Status:</span>
                <span className={product?.countInStock > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {product?.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product?.countInStock > 0 && (
                <div className="flex justify-between items-center mb-3 animate__animated animate__fadeIn animate__delay-1s">
                  <span className="text-gray-700">Quantity:</span>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-1 shadow-sm bg-gray-100">
                    <button
                      className="text-gray-700 px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">{qty}</span>
                    <button
                      className="text-gray-700 px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                      onClick={() => setQty(qty < product.countInStock ? qty + 1 : product.countInStock)}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={addToCartHandler}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition transform hover:scale-105"
                disabled={product?.countInStock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductScreen;
