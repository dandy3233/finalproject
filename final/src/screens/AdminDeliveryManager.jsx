import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  UserCheck,
} from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paidFilter, setPaidFilter] = useState("all");
  const [deliveredFilter, setDeliveredFilter] = useState("all");
  const [deliveredByFilter, setDeliveredByFilter] = useState("all");
  const [assignActor, setAssignActor] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/api/orders/"),
          fetch("http://localhost:8000/api/delivery_user/"),
        ]);
        if (!ordersRes.ok || !usersRes.ok) throw new Error("Fetch failed");

        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        setOrders(ordersData);
        setActors(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesPaid =
      paidFilter === "all" || (paidFilter === "paid" ? order.isPaid : !order.isPaid);
    const matchesDelivered =
      deliveredFilter === "all" || (deliveredFilter === "delivered" ? order.isDelivered : !order.isDelivered);
    const matchesDeliveredBy =
      deliveredByFilter === "all" || order.delivereBy === deliveredByFilter;
    return matchesPaid && matchesDelivered && matchesDeliveredBy;
  });

  const handleAssign = async () => {
    if (!assignActor || selectedOrders.length === 0) return;
    try {
      const res = await fetch("http://localhost:8000/api/assign_delivery/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ids: selectedOrders, delivered_by: assignActor }),
      });

      if (!res.ok) throw new Error("Assignment failed");

      const updated = await res.json();
      console.log(updated);

      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order._id)
            ? { ...order, delivereBy: assignActor }
            : order
        )
      );
      setSelectedOrders([]);
      setAssignActor("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-green-600 text-center">
        <Truck className="inline-block mr-2" /> Order Management
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)} className="border px-4 py-2 rounded-lg shadow-sm">
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <select value={deliveredFilter} onChange={(e) => setDeliveredFilter(e.target.value)} className="border px-4 py-2 rounded-lg shadow-sm">
          <option value="all">All Deliveries</option>
          <option value="delivered">Delivered</option>
          <option value="undelivered">Undelivered</option>
        </select>

        <select value={deliveredByFilter} onChange={(e) => setDeliveredByFilter(e.target.value)} className="border px-4 py-2 rounded-lg shadow-sm">
          <option value="all">All Actors</option>
          {actors.map((actor) => (
            <option key={actor.id} value={actor.username}>{actor.username}</option>
          ))}
        </select>
      </div>

      {/* Assign Actor */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <select value={assignActor} onChange={(e) => setAssignActor(e.target.value)} className="border px-4 py-2 rounded-lg shadow-sm w-full md:w-auto">
          <option value="">Select Actor</option>
          {actors.map((actor) => (
            <option key={actor.id} value={actor.username}>{actor.username}</option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          <UserCheck className="inline-block w-4 h-4 mr-2" />
          Assign Selected Orders
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                  onChange={(e) =>
                    setSelectedOrders(e.target.checked ? filteredOrders.map((o) => o._id) : [])
                  }
                />
              </th>
              <th className="p-3">Order #</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Total</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Delivered</th>
              <th className="p-3">Delivered By</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) => {
                      setSelectedOrders((prev) =>
                        e.target.checked
                          ? [...prev, order._id]
                          : prev.filter((id) => id !== order._id)
                      );
                    }}
                  />
                </td>
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3">{`${order.first_name} ${order.last_name}`}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">
                  <DollarSign className="inline-block w-4 h-4 text-green-600 mr-1" />
                  ${(Number(order.totalPrice) || 0).toFixed(2)}
                </td>
                <td className="p-3">
                  {order.isPaid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </td>
                <td className="p-3">
                  {order.isDelivered ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </td>
                <td className="p-3">{order.delivereBy || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
