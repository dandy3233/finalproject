import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  PackageCheck,
  Boxes,
  Star,
  MessageCircleMore,
} from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products/", {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + (product.countInStock || 0), 0);
  const totalReviews = products.reduce((sum, product) => sum + (product.numReviews || 0), 0);
  const avgRating =
    products.length > 0
      ? (products.reduce((sum, product) => sum + (Number(product.rating) || 0), 0) / products.length).toFixed(1)
      : "N/A";

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold">Error: {error}</div>;

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: <PackageCheck className="text-green-600" size={32} />,
    },
    {
      label: "Total Stock",
      value: totalStock,
      icon: <Boxes className="text-green-600" size={32} />,
    },
    {
      label: "Average Rating",
      value: `${avgRating} ⭐`,
      icon: <Star className="text-green-600" size={32} />,
    },
    {
      label: "Total Reviews",
      value: totalReviews,
      icon: <MessageCircleMore className="text-green-600" size={32} />,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Product Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white border border-green-200 rounded-2xl p-5 text-center shadow-md"
          >
            <div className="flex items-center justify-center mb-2">{icon}</div>
            <h2 className="text-md font-semibold text-gray-700">{label}</h2>
            <p className="text-2xl font-bold text-green-600">
              {typeof value === "number" ? (
                <CountUp end={value} duration={1.5} />
              ) : (
                value
              )}
            </p>
          </motion.div>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="w-full table-auto text-sm text-left border border-gray-200">
            <thead className="bg-green-50 text-green-800 font-semibold">
              <tr>
                {["Image", "Name", "Brand", "Category", "Price", "Stock", "Rating", "Reviews", "Created At"].map(
                  (header) => (
                    <th key={header} className="p-3 border-b border-green-200">{header}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-green-50 transition">
                  <td className="p-2 border-b">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 object-cover rounded shadow-md"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="p-2 border-b font-semibold">{product.name}</td>
                  <td className="p-2 border-b">{product.brand || "N/A"}</td>
                  <td className="p-2 border-b">{product.category || "N/A"}</td>
                  <td className="p-2 border-b font-bold">${(Number(product.price) || 0).toFixed(2)}</td>
                  <td className="p-2 border-b">
                    <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                      {product.countInStock > 0 ? `${product.countInStock} Available` : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-2 border-b">{product.rating || "N/A"} ⭐</td>
                  <td className="p-2 border-b">{product.numReviews || 0}</td>
                  <td className="p-2 border-b">{new Date(product.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
