import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";

const CategoryScreen = () => {
  const { category } = useParams();
  console.log("Category from useParams:", category); // Debugging log

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    if (category) {
      dispatch(listProducts(category));
    }
  }, [dispatch, category]);

  return (
    <section className="bg-white">
      <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
        <h2 className="text-2xl font-bold mb-4 capitalize">
          {category ? category.replace("-", " ") : "All Products"}
        </h2>

        {/* Category Grid Section */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
          {/* Wine */}
          {/* <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto md:h-full flex flex-col">
            <Link to="/category/wine" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
              <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940&auto=format&fit=crop" alt="Wine" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
              <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">Wine</h3>
            </Link>
          </div> */}

          {/* Gin & Other Drinks */}
          {/* <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
            <Link to="/category/gin" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4">
              <img src="https://images.unsplash.com/photo-1504675099198-7023dd85f5a3?q=80&w=2940&auto=format&fit=crop" alt="Gin" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
              <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">Gin</h3>
            </Link> */}

            {/* <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
              <Link to="/category/whiskey" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40">
                <img src="https://images.unsplash.com/photo-1571104508999-893933ded431?q=80&w=2940&auto=format&fit=crop" alt="Whiskey" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">Whiskey</h3>
              </Link> */}

              {/* <Link to="/category/vodka" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40">
                <img src="https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7?q=80&w=2940&auto=format&fit=crop" alt="Vodka" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
                <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">Vodka</h3>
              </Link>
            </div>
          </div> */}

          {/* Brandy */}
          {/* <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-sky-50 h-auto md:h-full flex flex-col">
            <Link to="/category/brandy" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
              <img src="https://images.unsplash.com/photo-1693680501357-a342180f1946?q=80&w=2940&auto=format&fit=crop" alt="Brandy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5"></div>
              <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4">Brandy</h3>
            </Link>
          </div>
        </div> */}

        {/* Filtered Products */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {products &&
              products
                .filter((product) => 
                  product.category &&
                  product.category.toLowerCase().replace(/\s+/g, "-") === category
                )
                .map((product) => (
                  <Product key={product._id} product={product} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryScreen;