import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paidFilter, setPaidFilter] = useState("all");
  const [deliveredFilter, setDeliveredFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/orders/", {
          headers: { "Content-Type": "application/json" },
        });

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

  // 🔵 Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const matchesPaid =
      paidFilter === "all" || (paidFilter === "paid" ? order.isPaid : !order.isPaid);
    const matchesDelivered =
      deliveredFilter === "all" || (deliveredFilter === "delivered" ? order.isDelivered : !order.isDelivered);
    return matchesPaid && matchesDelivered;
  });

  // 🟢 Stats
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const paidOrders = filteredOrders.filter((order) => order.isPaid).length;
  const deliveredOrders = filteredOrders.filter((order) => order.isDelivered).length;

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Order List</h1>

      {/* 🔵 Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <select
          value={paidFilter}
          onChange={(e) => setPaidFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <select
          value={deliveredFilter}
          onChange={(e) => setDeliveredFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="all">All Deliveries</option>
          <option value="delivered">Delivered</option>
          <option value="undelivered">Undelivered</option>
        </select>
      </div>

      {/* 🟢 Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Orders", value: totalOrders, color: "bg-blue-100" },
          { title: "Total Revenue", value: totalRevenue, color: "bg-green-100", prefix: "$" },
          { title: "Paid Orders", value: paidOrders, color: "bg-yellow-100" },
          { title: "Delivered Orders", value: deliveredOrders, color: "bg-purple-100" },
        ].map(({ title, value, color, prefix = "" }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`${color} p-4 rounded-lg text-center shadow-md`}
          >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-3xl font-bold">
              <CountUp start={0} end={value} duration={2} separator="," prefix={prefix} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🟢 Table */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders match the selected filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                {[
                  "Order Number",
                  "Name",
                  "Phone",
                  "Email",
                  "Instructions",
                  "Total",
                  "Paid",
                  "Delivered",
                  "Delivered At",
                 
                ].map((header) => (
                  <th key={header} className="p-2 border text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border hover:bg-gray-100">
                  <td className="p-2 border">{order.orderNumber}</td>
                  <td className="p-2 border">{`${order.first_name} ${order.last_name}`}</td>
                  <td className="p-2 border">{order.phone}</td>
                  <td className="p-2 border">{order.email}</td>
                  <td className="p-2 border">{order.instructions || "N/A"}</td>
                  <td className="p-2 border font-bold">${(Number(order.totalPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border">
                    <span className={order.isPaid ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span className={order.isDelivered ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "N/A"}</td>
                 
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
