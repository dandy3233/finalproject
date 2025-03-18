import React, { useState, useEffect } from 'react';
import Product from "../components/Product";
import axios from 'axios'; // Assuming you use axios for API calls

function WishlistScreen() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle potential errors

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);  // Start loading when fetch is initiated
        // Get wishlisted product IDs
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        if (wishlistIds.length === 0) {
          setWishlist([]);  // No products in wishlist
          setLoading(false);  // Done loading
          return;
        }

        // Fetch all products (replace with your actual API call)
        const { data } = await axios.get('http://localhost:8000/api/products/');
        
        // Filter products that are in the wishlist
        const wishlistedProducts = data.filter(product => 
          wishlistIds.includes(product._id)
        );
        
        setWishlist(wishlistedProducts);  // Set the wishlisted products
        setLoading(false);  // Done loading
      } catch {
        setError('Error fetching wishlist products. Please try again later.');
        setLoading(false);  // Done loading even if there is an error
      }
    };

    fetchWishlistProducts();
  }, []);

  return (
    <section className="bg-white py-4">
      <div className="max-w-screen-xl mx-auto sm:py-4 lg:px-6 px-2">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Wishlist</h1>
      {loading ? (
        <p className="text-gray-500">Loading your wishlist...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty. Start adding items!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(product => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
    </section>
  );
}

export default WishlistScreen;
