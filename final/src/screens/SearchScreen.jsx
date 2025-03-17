// src/screens/SearchScreen.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Product from '../components/Product';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

function SearchScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
           `http://localhost:8000/api/products/search/?q=${encodeURIComponent(searchQuery)}`
        );
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error searching products');
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [searchQuery]);  // Add searchQuery as dependency

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">
        Search Results for "{searchQuery}"
      </h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found matching your search</Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchScreen;