import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MultiStepProgressBar from '../components/MultiStepProgressBar';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { cartItems, paymentMethod } = cart;
  const TAX_RATE = 0.1;

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
    taxPrice: '0.00',
    shippingPrice: '0.00',
    totalPrice: '0.00',
    isPaid: false,
    isDelivered: false,
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const safeCartItems = (cartItems || []).map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  const safeSubtotal = safeCartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const safeTax = safeSubtotal * TAX_RATE;
  const safeShippingFee = safeSubtotal > 100 ? 0 : 10;
  const safeTotal = safeSubtotal + safeTax + safeShippingFee;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      taxPrice: safeTax.toFixed(2),
      shippingPrice: safeShippingFee.toFixed(2),
      totalPrice: safeTotal.toFixed(2),
    }));
    setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString());
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const numericData = {
        taxPrice: parseFloat(formData.taxPrice),
        shippingPrice: parseFloat(formData.shippingPrice),
        totalPrice: parseFloat(formData.totalPrice),
      };

      const orderData = {
        ...formData,
        ...numericData,
        paymentMethod,
        orderItems: safeCartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          product: item.product || item._id,
        })),
        orderNumber,
      };

      const response = await axios.post(
        'http://localhost:8000/api/orders/',
        orderData,
        {
          headers: {
            'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1],
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        generatePDF({ ...response.data, ...numericData, paymentMethod });
        setSuccessMessage(`Order placed successfully! Order #${orderNumber}`);
        setTimeout(() => navigate(`/orders/${response.data._id}`), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (order) => {
    const doc = new jsPDF();

    const drawStyledText = (text, x, y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(220, 38, 38);
      doc.text(text, x + 2, y + 2);
      doc.setTextColor(245, 158, 11);
      doc.text(text, x + 1, y + 1);
      doc.setTextColor(21, 128, 61);
      doc.text(text, x, y);
    };

    drawStyledText("African Star 🌟", 20, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Order Summary", 20, 35);
    doc.line(20, 40, 190, 40);

    const formatCurrency = (value) =>
      typeof value === 'number' ? `$${value.toFixed(2)}` : `$${Number(value || 0).toFixed(2)}`;

    autoTable(doc, {
      startY: 45,
      head: [["Field", "Value"]],
      body: [
        ["Order Number", order.orderNumber || 'N/A'],
        ["Payment Method", order.paymentMethod || 'N/A'],
        ["Tax Price", formatCurrency(order.taxPrice)],
        ["Shipping Price", formatCurrency(order.shippingPrice)],
        ["Total Price", formatCurrency(order.totalPrice)],
        ["Paid", order.isPaid ? "Yes" : "No"],
        ["Delivered", order.isDelivered ? "Yes" : "No"],
      ],
      theme: "grid",
    });

    doc.save(`Order_${order.orderNumber || 'N/A'}.pdf`);
  };

  return (
    <>
      <MultiStepProgressBar step1 step2 step3 step4 />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="bg-green-500 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Delivery Information
          </h1>
          <h1 className="text-2xl font-bold flex items-center gap-3 mt-2">
            Order #{orderNumber || 'Generating...'}
          </h1>
          <p className="mt-2 opacity-90">
            Please fill in the details below to complete your order
          </p>
        </div>

        <div className="p-6 space-y-8">
          <section className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {safeCartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.qty} x ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium">
                    ${(item.qty * Number(item.price)).toFixed(2)}
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

          <form onSubmit={submitOrderHandler} className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["firstName", "lastName", "phone", "email"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-2 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')} *
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "firstName" ? "firstName" : field === "phone" ? "tel" : "text"}
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

            <section>
              <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="street_address"
                  placeholder="Street Address"
                  value={formData.street_address}
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-100 text-green-700 rounded">{successMessage}</div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default PlaceOrder;
