// src/screens/WishlistScreen.jsx
import React, { useState, useEffect } from 'react';
import Product from "../components/Product";
import axios from 'axios'; // Assuming you use axios for API calls

function WishlistScreen() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        // Get wishlisted product IDs
        const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Fetch all products (replace with your actual API call)
        const { data } = await axios.get('http://localhost:8000/api/products/');
        // Filter products that are in the wishlist
        const wishlistedProducts = data.filter(product => 
          wishlistIds.includes(product._id)
        );
        setWishlist(wishlistedProducts);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlistProducts();
  }, []);

  return (
    <div className="py-3">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty. Start adding items!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(product => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistScreen;