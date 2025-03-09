import React, { useState, useEffect } from "react";

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

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Product List</h1>
       {/* ✅ Total Products Count */}
<div className="mt-6 flex justify-center">
  <div className="bg-white shadow-lg border-2 border-blue-500 rounded-lg px-6 py-4 text-center">
    <h2 className="text-xl font-bold text-gray-700">Total Products</h2>
    <p className="text-3xl font-extrabold text-blue-500">{products.length}</p>
  </div>
</div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  {["Image", "Name", "Brand", "Category", "Price", "Stock", "Rating", "Reviews", "Created At"].map(
                    (header) => (
                      <th key={header} className="p-2 border text-left">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border hover:bg-gray-100">
                    {/* ✅ Image Column */}
                    <td className="p-2 border">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded shadow-md"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="p-2 border font-semibold">{product.name}</td>
                    <td className="p-2 border">{product.brand || "N/A"}</td>
                    <td className="p-2 border">{product.category || "N/A"}</td>
                    <td className="p-2 border font-bold">${(Number(product.price) || 0).toFixed(2)}</td>
                    <td className="p-2 border">
                      <span
                        className={product.countInStock > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}
                      >
                        {product.countInStock > 0 ? `${product.countInStock} Available` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-2 border">{product.rating || "N/A"} ⭐</td>
                    <td className="p-2 border">{product.numReviews || 0} Reviews</td>
                    <td className="p-2 border">{new Date(product.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
