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
    image: "https://images.unsplash.com/photo-1580502304784-2d6e3d17c5ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1602810310591-29c6358d6f3f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Men's Clothing",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dandy",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Phone and Telecommunications",
    image: "https://images.unsplash.com/photo-1510552776732-01acc9a4c6b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Consumer Electronics",
    image: "https://images.unsplash.com/photo-1581092334641-4c4c06c9f1d1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hair Extensions & Wigs",
    image: "https://images.unsplash.com/photo-1594824476965-123bba1af8ac?auto=format&fit=crop&w=800&q=80",
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
