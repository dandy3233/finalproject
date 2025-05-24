import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MultiStepProgressBar from '../components/MultiStepProgressBar';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

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

  // Ensure safe numbers for prices
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

      const confirmation_number = Math.floor(100000 + Math.random() * 900000).toString();
      const orderData = {
        ...formData,
        ...numericData,
        isPaid: true,
        isDelivered: true,
        paymentMethod,
        orderItems: safeCartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          product: item.product || item._id,
        })),
        orderNumber,
        confirmation_number,
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
        generatePDF({ ...response.data, ...numericData, paymentMethod, confirmation_number });
        setSuccessMessage(`Order placed successfully! Order #${orderNumber}`);
        setTimeout(() => navigate(`/orders/${response.data._id}`), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (value) =>
    typeof value === 'number' ? `$${value.toFixed(2)}` : `$${Number(value || 0).toFixed(2)}`;

  // PDF generation with styled heading and table
  // PDF generation with enhanced styling and custom font
const generatePDF = async (order) => {
  try {
    const doc = new jsPDF();

    // Title with shadowed style
    const drawStyledText = (text, x, y) => {
      doc.setFont("times", "bold"); // Replaced helvetica
      doc.setFontSize(28);
      doc.setTextColor(50, 50, 50);
      doc.text(text, x + 1.5, y + 1.5);
      doc.setTextColor(34, 197, 94); // emerald-500
      doc.text(text, x, y);
    };

    drawStyledText("Star 🌟", 55, 25);

    // Header subtitle
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(64, 64, 64);
    doc.text("Order Summary Report", 15, 40);

    // Decorative line
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(1);
    doc.line(15, 43, 195, 43);

    // Order summary table
    autoTable(doc, {
      startY: 50,
      theme: "grid",
      head: [["Detail", "Value"]],
      body: [
        ["Order Number", order.orderNumber || 'N/A'],
        ["Confirmation Code", order.confirmation_number || 'N/A'],
        ["Payment Method", order.paymentMethod || 'N/A'],
        ["Tax", formatCurrency(order.taxPrice)],
        ["Shipping", formatCurrency(order.shippingPrice)],
        ["Total", formatCurrency(order.totalPrice)],
        ["Paid", order.isPaid ? "Yes" : "No"],
        ["Delivered", order.isDelivered ? "Yes" : "No"],
      ],
      headStyles: {
        fillColor: [21, 128, 61],
        textColor: 255,
        fontStyle: "bold",
        font: "times"
      },
      bodyStyles: {
        font: "times",
        textColor: [40, 40, 40]
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 10, left: 15, right: 15 },
    });

    // QR Code for order tracking
    const qrCodeData = order.confirmation_number || order.orderNumber || 'NoCode';
    const qrURL = `https://yourwebsite.com/order/confirm/${qrCodeData}`;
    let qrDataUrl = '';

    try {
      qrDataUrl = await QRCode.toDataURL(qrURL);
    } catch (err) {
      console.error("QR Code generation failed:", err);
    }

    if (qrDataUrl) {
      const qrSize = 50;
      const pageHeight = doc.internal.pageSize.height;
      doc.addImage(qrDataUrl, 'PNG', 150, pageHeight - qrSize - 20, qrSize, qrSize);
      doc.setFontSize(10);
      doc.text("Scan to Confirm Order", 150, pageHeight - qrSize - 25);
    }

    // Footer
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for shopping with African Star!", 15, doc.internal.pageSize.height - 10);

    // Save PDF
    doc.save(`Order_${order.orderNumber || 'N_A'}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};


  return (
    <>
      <MultiStepProgressBar step1 step2 step3 step4 />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-10"
      >
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-wide">
            Delivery Information
          </h1>
          <h1 className="text-2xl font-semibold flex items-center gap-3 mt-2">
            Order #{orderNumber || 'Generating...'}
          </h1>
          <p className="mt-2 opacity-90 text-green-100">
            Please fill in the details below to complete your order
          </p>
        </div>

        <div className="p-8 space-y-10">
          {/* Order Summary Section */}
          <section className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-green-800 border-b border-green-300 pb-2">
              Order Summary
            </h2>
            <div className="space-y-6">
              {safeCartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-semibold text-green-900">{item.name}</h3>
                    <p className="text-sm text-green-700">
                      {item.qty} x ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-green-900">
                    ${(item.qty * Number(item.price)).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-6 border-t space-y-4 text-green-900 font-semibold">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>${safeSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Tax</span>
                  <span>${safeTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Shipping</span>
                  <span>{safeShippingFee === 0 ? "Free" : `$${safeShippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-green-300">
                  <span>Total</span>
                  <span className="text-green-700">${safeTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Order Form */}
          <form onSubmit={submitOrderHandler} className="space-y-8">
            {/* Contact Details */}
            <section>
              <h2 className="text-xl font-semibold mb-6 text-green-800 border-b border-green-300 pb-2">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["firstName", "lastName", "phone", "email"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium mb-2 text-green-900 capitalize"
                    >
                      {field.replace(/([A-Z])/g, ' $1')} *
                    </label>
                    <input
                      id={field}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      required
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address */}
            <section>
              <h2 className="text-xl font-semibold mb-6 text-green-800 border-b border-green-300 pb-2">
                Delivery Address
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Street Address"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="px-4 py-3 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Additional Instructions */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-green-800 border-b border-green-300 pb-2">
                Additional Instructions
              </h2>
              <textarea
                name="instructions"
                rows="4"
                placeholder="Any special instructions?"
                value={formData.instructions}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-green-300 rounded-lg shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </section>

            {/* Error and Success Messages */}
            {error && (
              <p className="text-red-600 bg-red-100 px-4 py-3 rounded-md shadow-sm border border-red-300">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-700 bg-green-100 px-4 py-3 rounded-md shadow-sm border border-green-300">
                {successMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-semibold text-white transition ${
                loading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400'
              }`}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default PlaceOrder;
