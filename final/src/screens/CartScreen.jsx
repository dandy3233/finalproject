import React, { useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import MultiStepProgressBar from "../components/MultiStepProgressBar";

function CartScreen() {
  const { id: productId } = useParams();
  const location = useLocation();
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const cart = useSelector((state) => state.cart);
  const { cartItems, loading, error } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  // ✅ Order Summary Calculations (Ensure price is a number)
  const TAX_RATE = 0.1;
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 10;

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.qty, 0);
  const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + shippingFee;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <MultiStepProgressBar step1 />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message variant="info">
                Your cart is empty. <Link to="/" className="text-green-500">Go back</Link>
              </Message>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white">
                    <div className="flex items-center space-x-4">
                      <Link to={`/product/${item.product}`}>
                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                      </Link>
                      <div className="flex flex-col">
                        <Link className="text-lg font-semibold text-gray-800 hover:text-green-600" to={`/product/${item.product}`}>
                          {item.name}
                        </Link>
                        <span className="text-sm text-gray-500">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 bg-gray-100">
                        <button className="text-gray-700 px-2 py-1" onClick={() => item.qty > 1 && dispatch(addToCart(item.product, item.qty - 1))}>-</button>
                        <span className="text-lg font-semibold">{item.qty}</span>
                        <button className="text-gray-700 px-2 py-1" onClick={() => item.qty < item.countInStock && dispatch(addToCart(item.product, item.qty + 1))}>+</button>
                      </div>
                      <button className="bg-red-500 text-white p-2 rounded-full" onClick={() => removeFromCartHandler(item.product)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Order Summary */}
          <div className="p-6 border rounded-lg shadow-lg bg-gray-50">
            <h1 className="text-2xl font-bold text-center mb-6">Order Summary</h1>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="button" className="w-full py-3 mt-6 bg-green-500 text-white rounded-lg" disabled={cartItems.length === 0} onClick={checkoutHandler}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
