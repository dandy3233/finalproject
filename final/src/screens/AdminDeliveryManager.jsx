import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paidFilter, setPaidFilter] = useState("all");
  const [deliveredFilter, setDeliveredFilter] = useState("all");
  const [deliveredByFilter, setDeliveredByFilter] = useState("all");
  const [assignActor, setAssignActor] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);

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

  // Filtering
  const filteredOrders = orders.filter((order) => {
    const matchesPaid =
      paidFilter === "all" || (paidFilter === "paid" ? order.isPaid : !order.isPaid);
    const matchesDelivered =
      deliveredFilter === "all" ||
      (deliveredFilter === "delivered" ? order.isDelivered : !order.isDelivered);
    const matchesDeliveredBy =
      deliveredByFilter === "all" || order.deliveredBy === deliveredByFilter;
    return matchesPaid && matchesDelivered && matchesDeliveredBy;
  });

  const uniqueDeliveryActors = [...new Set(orders.map((o) => o.deliveredBy).filter(Boolean))];

  // Assign delivery actor to selected orders
  const handleAssign = async () => {
    if (!assignActor || selectedOrders.length === 0) return;
    try {
      const response = await fetch("http://localhost:8000/api/assign_delivery/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ids: selectedOrders, delivered_by: assignActor }),
      });

      if (!response.ok) throw new Error("Failed to assign");

      const updatedOrders = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order._id)
            ? { ...order, deliveredBy: assignActor }
            : order
        )
      );
      setSelectedOrders([]);
      setAssignActor("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Order List</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <select value={deliveredFilter} onChange={(e) => setDeliveredFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value="all">All Deliveries</option>
          <option value="delivered">Delivered</option>
          <option value="undelivered">Undelivered</option>
        </select>

        <select value={deliveredByFilter} onChange={(e) => setDeliveredByFilter(e.target.value)} className="border px-4 py-2 rounded">
          <option value="all">All Delivery Actors</option>
          {uniqueDeliveryActors.map((actor) => (
            <option key={actor} value={actor}>{actor}</option>
          ))}
        </select>
      </div>

      {/* Assign Section */}
      <div className="flex gap-4 items-center mb-6 justify-center">
        <select value={assignActor} onChange={(e) => setAssignActor(e.target.value)} className="border px-4 py-2 rounded">
          <option value="">Select Actor to Assign</option>
          {uniqueDeliveryActors.map((actor) => (
            <option key={actor} value={actor}>{actor}</option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign to Selected
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">
                <input
                  type="checkbox"
                  checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(filteredOrders.map((o) => o._id));
                    } else {
                      setSelectedOrders([]);
                    }
                  }}
                />
              </th>
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
                "Delivered By",
              ].map((header) => (
                <th key={header} className="p-2 border text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border hover:bg-gray-100">
                <td className="p-2 border">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders((prev) => [...prev, order._id]);
                      } else {
                        setSelectedOrders((prev) => prev.filter((id) => id !== order._id));
                      }
                    }}
                  />
                </td>
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
                <td className="p-2 border">{order.deliveredBy || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
