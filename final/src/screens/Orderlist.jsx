import React, { useState, useEffect } from "react";
// import { orderList } from '../actions/orderActions';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const dispatch = useDispatch();


  // useEffect(() => {
  //     dispatch(orderList(id));
  //   }, [dispatch, id]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/orders/orders/", {
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

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Order List</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                {["ID", "User", "Payment Method", "Tax", "Shipping", "Total", "Paid", "Paid At", "Delivered", "Delivered At", "Created At"].map((header) => (
                  <th key={header} className="p-2 border text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border hover:bg-gray-100">
                  <td className="p-2 border">{order._id}</td>
                  <td className="p-2 border">{typeof order.user === "object" ? order.user.username : order.user || "Unknown"}</td>
                  <td className="p-2 border">{order.paymentMethod || "N/A"}</td>
                  <td className="p-2 border">${(Number(order.taxPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border">${(Number(order.shippingPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border font-bold">${(Number(order.totalPrice) || 0).toFixed(2)}</td>
                  <td className="p-2 border">
                    <span className={order.isPaid ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">{order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "N/A"}</td>
                  <td className="p-2 border">
                    <span className={order.isDelivered ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 border">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "N/A"}</td>
                  <td className="p-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
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
