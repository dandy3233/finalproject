import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MultiStepProgressBar from '../components/MultiStepProgressBar';
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PlaceOrder = () => {
  const cart = useSelector((state) => state.cart);
  const { cartItems, paymentMethod } = cart;
  const TAX_RATE = 0.1;

  const calculatePrices = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.qty, 0);
    const taxPrice = subtotal * TAX_RATE;
    const shippingPrice = subtotal > 100 ? 0 : 10;
    const totalPrice = subtotal + taxPrice + shippingPrice;
    return { shippingPrice, taxPrice, totalPrice };
  };

  const [formData, setFormData] = useState({
    taxPrice: '0.00',
    shippingPrice: '0.00',
    totalPrice: '0.00',
    isPaid: false,
    isDelivered: false
  });

  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const { shippingPrice, taxPrice, totalPrice } = calculatePrices();
    setFormData(prev => ({
      ...prev,
      taxPrice: taxPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    }));
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const numericData = {
        taxPrice: parseFloat(formData.taxPrice),
        shippingPrice: parseFloat(formData.shippingPrice),
        totalPrice: parseFloat(formData.totalPrice)
      };

      const orderData = {
        paymentMethod,
        ...formData,
        ...numericData,
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          product: item.product
        }))
      };

      const response = await axios.post(
        'http://localhost:8000/api/orders/',
        orderData,
        {
          headers: {
            'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1],
            'Content-Type': 'application/json'
          }
        }
      );

      // Debugging: Log the full response to check its structure
      console.log('Response:', response);

      if (response.status === 201) {
        const completeOrderData = {
          ...response.data.data,  // ⬅️ Adjust this line if necessary
          ...numericData,
          paymentMethod
        };

        console.log('Order Data:', completeOrderData);  // Log to see the order data

        setOrderNumber(completeOrderData.orderNumber || completeOrderData._id);
        alert(`Order created! Number: ${completeOrderData.orderNumber || completeOrderData._id}`);

        generatePDF(completeOrderData);

        setFormData({
          taxPrice: '0.00',
          shippingPrice: '0.00',
          totalPrice: '0.00',
          isPaid: false,
          isDelivered: false
        });
      }
    } catch (error) {
      setError(error.response?.data || error.message);
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
    doc.setTextColor(202, 138, 4);
    doc.text(text, x, y - 0.5);
  };

  const formatCurrency = (value) =>
    typeof value === 'number' ? `$${value.toFixed(2)}` : `$${value || '0.00'}`;

  drawStyledText("African Star 🌟", 20, 20);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Order Summary", 20, 35);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Ensure 'orderNumber' is not null or undefined, fallback to "N/A"
  const orderNumber = order.orderNumber || "N/A";  // Safely fallback to "N/A" if no orderNumber is found
  const paymentMethod = order.paymentMethod || "N/A";  // Ensure paymentMethod is not empty

  autoTable(doc, {
    startY: 45,
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontSize: 12
    },
    bodyStyles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 50 },
    head: [["Field", "Value"]],
    body: [
      ["Order Number", orderNumber],  // Make sure this always has a value, fallback to "N/A"
      ["Payment Method", paymentMethod],  // Make sure this always has a value, fallback to "N/A"
      ["Tax Price", formatCurrency(order.taxPrice)],
      ["Shipping Price", formatCurrency(order.shippingPrice)],
      ["Total Price", formatCurrency(order.totalPrice)],
      ["Paid", order.isPaid ? "Yes" : "No"],
      ["Delivered", order.isDelivered ? "Yes" : "No"]
    ],
    theme: "grid",
  });

  doc.save(`Order_${orderNumber || "Report"}.pdf`);  // Ensure the file name uses a valid order number or fallback
};


  return (
    <>
      <MultiStepProgressBar step1 step2 step3 step4 />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <h1 className="text-3xl font-bold mb-6">Place Order</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {JSON.stringify(error, null, 2)}
          </div>
        )}

        <form onSubmit={submitOrderHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <input
              type="text"
              value={paymentMethod}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['taxPrice', 'shippingPrice', 'totalPrice'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1">
                  {field.replace(/([A-Z])/g, ' $1')} ($)
                </label>
                <input
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded bg-gray-100"
                  step="0.01"
                  min="0"
                  readOnly
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {['isPaid', 'isDelivered'].map((field) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  checked={formData[field]}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {field.replace('is', '')}
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </motion.div>
    </>
  );
};

export default PlaceOrder;
