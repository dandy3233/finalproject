import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Truck,
} from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/orders/");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const paidOrders = orders.filter(order => order.isPaid).length;
  const deliveredOrders = orders.filter(order => order.isDelivered).length;

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold">Error: {error}</div>;

  const summaryCards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="text-green-600" size={32} />,
    },
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: <DollarSign className="text-green-600" size={32} />,
      prefix: "$",
    },
    {
      title: "Paid Orders",
      value: paidOrders,
      icon: <CheckCircle className="text-green-600" size={32} />,
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: <Truck className="text-green-600" size={32} />,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Order Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ title, value, icon, prefix = "" }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white border border-green-200 rounded-2xl p-5 text-center shadow-md"
          >
            <div className="flex items-center justify-center mb-2">{icon}</div>
            <h2 className="text-md font-semibold text-gray-700">{title}</h2>
            <p className="text-2xl font-bold text-green-600">
              <CountUp start={0} end={value} duration={2} separator="," prefix={prefix} />
            </p>
          </motion.div>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full table-auto text-sm text-left border border-gray-200">
            <thead className="bg-green-50 text-green-800 font-semibold">
              <tr>
                {["Order #", "User", "Payment", "Tax", "Shipping", "Total", "Paid", "Paid At", "Delivered", "Delivered At", "Created At"].map(header => (
                  <th key={header} className="p-3 border-b border-green-200">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-green-50 transition">
                  <td className="p-2 border-b">{order.orderNumber}</td>
                  <td className="p-2 border-b">{order.user?.username || "Unknown"}</td>
                  <td className="p-2 border-b">{order.paymentMethod || "N/A"}</td>
                  <td className="p-2 border-b">${(Number(order.taxPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border-b">${(Number(order.shippingPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border-b font-bold">${(Number(order.totalPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border-b">
                    <span className={order.isPaid ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border-b">{order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "N/A"}</td>
                  <td className="p-2 border-b">
                    <span className={order.isDelivered ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border-b">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "N/A"}</td>
                  <td className="p-2 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
