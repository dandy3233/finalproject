import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MultiStepProgressBar from '../components/MultiStepProgressBar';
import Loader from '../components/Loader';
import Message from '../components/Message';

const DeliveryOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = true; // Simulated logged-in user

  const {
    cartItems = [],
    subtotal = 0,
    tax = 0,
    shippingFee = 0,
    total = 0,
  } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    instructions: '',
    taxPrice: tax,
    shippingPrice: shippingFee,
    totalPrice: total,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const safeCartItems = cartItems.map(item => ({
    ...item,
    price: Number(item?.price || 0),
    qty: Number(item?.qty || 0),
    _id: item?._id || '',
    name: item?.name || 'Unnamed Product',
    image: item?.image || '',
  }));

  const safeSubtotal = Number(subtotal || 0);
  const safeTax = Number(tax || 0);
  const safeShippingFee = Number(shippingFee || 0);
  const safeTotal = Number(total || 0);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!location.state || cartItems.length === 0) {
      navigate('/cart');
    }

    // Generate random order number when component loads
    const generatedOrderNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit
    setOrderNumber(generatedOrderNumber);
  }, [userInfo, location.state, cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phone.match(phonePattern)) {
      setError('Please enter a valid phone number.');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const deliveryOrderData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      instructions: formData.instructions,
      orderNumber: orderNumber, // 👈 sending generated orderNumber
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/DeliveryOrder/',
        deliveryOrderData,
        {
          headers: {
            'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1],
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        if (!responseData._id) {
          setError('Order ID is not valid');
          return;
        }
        setSuccessMessage('Your order has been confirmed!');
        navigate(`/DeliveryOrder/${responseData._id}`, { state: { DeliveryOrder: responseData }, replace: true });
      } else {
        throw new Error('Failed to create delivery order');
      }
    } catch (err) {
      console.error('POST ERROR:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <MultiStepProgressBar step1 step2 />

      {loading && <Loader />}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="bg-green-500 text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          Delivery Information
        </h1>
        <h1 className="text-2xl font-bold flex items-center gap-3 mt-2">
          Order #{orderNumber || 'Generating...'}
        </h1>
        <p className="mt-2 opacity-90">Please fill in the details below to complete your order</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Order Summary */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Order Summary
          </h2>
          <div className="space-y-4">
            {safeCartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.qty} x ${item.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-medium">
                  ${(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${safeSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${safeTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{safeShippingFee === 0 ? "Free" : `$${safeShippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3">
                <span>Total</span>
                <span className="text-green-600">${safeTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Details */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["firstName", "lastName", "phone", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')} *
                  </label>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Address */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Delivery Address
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="streetAddress"
                placeholder="Street Address"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select State</option>
                  <option value="CA">California</option>
                </select>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                </select>
              </div>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Special delivery instructions"
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Confirm Order ($${safeTotal.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryOrder;
