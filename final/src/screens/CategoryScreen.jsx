import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";

const categories = [
  {
    name: "Shoes",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2940&auto=format&fit=crop",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2940&auto=format&fit=crop",
  },
  {
    name: "Men's Clothing",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=2940&auto=format&fit=crop",
  },
  {
    name: "Dandy",
    image: " https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2940&auto=format&fit=crop",
  },

  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop",
  },
];


const AllProductsScreen = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    const productsToDisplay = category
      ? products.filter(
          (product) => product.category?.toLowerCase().replace(/\s+/g, "-") === category
        )
      : products;

    setFilteredProducts(productsToDisplay);
  }, [products, category]);

  return (
    <section className="bg-white py-4">
      <div className="max-w-screen-xl mx-auto sm:py-4 lg:px-6 px-2">
        <h2 className="text-2xl font-bold mb-4 capitalize">
          {category ? category.replace("-", " ") : "All Products"}
        </h2>

        {/* Category Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
          {categories
            .filter((cat) => !category || cat.name.toLowerCase().replace(/\s+/g, "-") === category)
            .map((cat) => (
              <div key={cat.name} className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 flex flex-col rounded-lg overflow-hidden">
                <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`} className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">
                    {cat.name}
                  </h3>
                </Link>
              </div>
            ))}
        </div>

        {/* Display Filtered Products */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-500 col-span-full text-center">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default AllProductsScreen;
