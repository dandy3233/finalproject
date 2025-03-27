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
      navigate("/login?redirect=shipping");
    } else {
      navigate("/shipping");
    }
  };

  // ✅ Order Summary Calculations
  const TAX_RATE = 0.1;
  const FREE_SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 10;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.qty,
    0
  );
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message variant="info">
                Your cart is empty.{" "}
                <Link to="/" className="text-green-500 hover:underline">
                  Go back
                </Link>
              </Message>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center justify-between p-5 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-5">
                      <Link to={`/product/${item.product}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex flex-col">
                        <Link
                          className="text-lg font-semibold text-gray-800 hover:text-green-600 transition"
                          to={`/product/${item.product}`}
                        >
                          {item.name}
                        </Link>
                        <span className="text-sm text-gray-500">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 bg-gray-100">
                        <button
                          className="text-gray-700 px-2 py-1 hover:bg-gray-200 rounded transition"
                          onClick={() =>
                            item.qty > 1 && dispatch(addToCart(item.product, item.qty - 1))
                          }
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold mx-2">{item.qty}</span>
                        <button
                          className="text-gray-700 px-2 py-1 hover:bg-gray-200 rounded transition"
                          onClick={() =>
                            item.qty < item.countInStock &&
                            dispatch(addToCart(item.product, item.qty + 1))
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Order Summary */}
          <div className="p-6 border rounded-lg shadow-md bg-gray-50">
            <h1 className="text-2xl font-bold text-center mb-6">Order Summary</h1>
            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span className="text-gray-700">Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 mt-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
