import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function MultiStProgressBar({ step2, step3, step4 }) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  return (
    <div className="flex justify-center space-x-4 mb-4">
      <div>
        {cartItems.length > 0 ? (
          <Link to="/cart" className="px-4 py-2 rounded-full bg-green-600 text-white">
            Cart Items
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full bg-gray-300 text-gray-600">Cart Items</span>
        )}
      </div>

      <div>
        {step2 ? (
          <Link to="/shipping" className="px-4 py-2 rounded-full bg-green-600 text-white">
            Shipping
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full bg-gray-300 text-gray-600">Shipping</span>
        )}
      </div>

      <div>
        {step3 ? (
          <Link to="/payment" className="px-4 py-2 rounded-full bg-green-600 text-white">
            Payment
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full bg-gray-300 text-gray-600">Payment</span>
        )}
      </div>

      <div>
        {step4 ? (
          <Link to="/placeorder" className="px-4 py-2 rounded-full bg-green-600 text-white">
            Place Order
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-full bg-gray-300 text-gray-600">Place Order</span>
        )}
      </div>
    </div>
  );
}

export default MultiStProgressBar;
