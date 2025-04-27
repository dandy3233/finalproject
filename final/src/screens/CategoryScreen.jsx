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
    image: "/images/category/shoes.png",
  },
  {
    name: "Accessories",
    image: "/images/category/accessories.png",
  },
  {
    name: "Men's Clothing",
    image: "/images/category/mens_clothing.png",
  },
  {
    name: "Dandy",
    image: "/images/category/dandy.jpg",
  },
  {
    name: "Electronics",
    image: "/images/category/electronics.png",
  },
  {
    name: "Phone and Telecommunications",
    image: "/images/category/phone_telecommunications.png",
  },
  {
    name: "Home & Garden",
    image: "/images/category/home_garden.png",
  },
  {
    name: "Consumer Electronics",
    image: "/images/category/consumer_electronics.png",
  },
  {
    name: "Hair Extensions & Wigs",
    image: "/images/category/hair_extensions_wigs.png",
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
      <div className="max-w-screen-xl text-center mx-auto sm:py-4 lg:px-6 px-2">
        <h2 className=" mb-4 capitalize text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
          {category ? category.replace("-", " ") : "Shop by category"}
        </h2>

        {/* Category Grid Section */}
        {!category && (
          <>
            {/* Featured Custom Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full mt-6">
              {/* Left Big Card */}
              <div className="col-span-2 sm:col-span-1 md:col-span-2 flex flex-col bg-gray-50">
                <Link
                  to={`/category/${categories[0].name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
                >
                  <img
                    src={categories[0].image}
                    alt={categories[0].name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">{categories[0].name}</h3>
                </Link>
              </div>

              {/* Middle Block with Two Sub-Cards */}
              <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
                <Link
                  to={`/category/${categories[1].name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4"
                >
                  <img
                    src={categories[1].image}
                    alt={categories[1].name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">{categories[1].name}</h3>
                </Link>

                <div className="grid gap-4 grid-cols-2">
                  {[2, 3].map((i) => (
                    <Link
                      key={categories[i].name}
                      to={`/category/${categories[i].name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                    >
                      <img
                        src={categories[i].image}
                        alt={categories[i].name}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                      <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">{categories[i].name}</h3>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Tall Card */}
              <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-sky-50 flex flex-col">
                <Link
                  to={`/category/${categories[4].name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow"
                >
                  <img
                    src={categories[4].image}
                    alt={categories[4].name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">{categories[4].name}</h3>
                </Link>
              </div>
            </div>

            {/* Additional 3 Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {[6, 7, 8].map((i) => (
                <Link
                  key={categories[i].name}
                  to={`/category/${categories[i].name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 bg-white shadow hover:shadow-lg transition duration-300"
                >
                  <img
                    src={categories[i].image}
                    alt={categories[i].name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">
                    {categories[i].name}
                  </h3>
                </Link>
              ))}
            </div>
          </>
        )}

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
          <p className="text-lg text-gray-500 col-span-full text-center mt-6">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default AllProductsScreen;
