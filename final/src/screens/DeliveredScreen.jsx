import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, DollarSign } from "lucide-react";

const DeliveredScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState({});

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/orders/");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        const assignedOrders = data.filter((order) => order.status === "Assigned");
        setOrders(assignedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, []);

  const handleConfirmDelivery = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    const confNumber = confirmationNumber[orderId];

    if (!confNumber) {
      setError("Please enter a confirmation number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/confirm_delivery/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          confirmation_number: confNumber,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Confirmation failed");
      }

      const { order: updatedOrder } = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                is_delivered: true,
                status: "Done",
                delivered_at: updatedOrder.delivered_at,
                confirmation_number: confNumber,
              }
            : o
        )
      );
      setConfirmationNumber((prev) => ({ ...prev, [orderId]: "" }));
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-600 text-center">
        Assigned Orders for Delivery
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Total</th>
              <th className="p-3">Delivered</th>
              <th className="p-3">Delivered By</th>
              <th className="p-3">Confirmation</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{order.orderNumber}</td>
                <td className="p-3">{order.first_name + " " + order.last_name}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">
                  <DollarSign className="inline-block w-4 h-4 text-green-600 mr-1" />
                  ${(Number(order.totalPrice) || 0).toFixed(2)}
                </td>
                <td className="p-3">
                  {order.isDelivered ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </td>
                <td className="p-3">{order.delivereBy || "N/A"}</td>
                <td className="p-3">
                  {!order.is_delivered ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter Conf. #"
                        value={confirmationNumber[order._id] || ""}
                        onChange={(e) =>
                          setConfirmationNumber((prev) => ({
                            ...prev,
                            [order._id]: e.target.value,
                          }))
                        }
                        className="border px-2 py-1 rounded-lg w-24"
                      />
                      <button
                        onClick={() => handleConfirmDelivery(order._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <span>{order.confirmation_number || "Confirmed"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveredScreen;
