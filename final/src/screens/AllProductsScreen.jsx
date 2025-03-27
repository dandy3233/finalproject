// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, Link } from "react-router-dom";
// import { listProducts } from "../actions/productActions";
// import Product from "../components/Product";
// import Loader from "../components/Loader";
// import Message from "../components/Message";

// const CategoryScreen = () => {
//   const { category } = useParams();
//   console.log("Category from useParams:", category); // Debugging log

//   const dispatch = useDispatch();

//   const productList = useSelector((state) => state.productList);
//   const { loading, error, products } = productList;

//   useEffect(() => {
//     if (category) {
//       dispatch(listProducts(category));
//     }
//   }, [dispatch, category]);

//   return (
//     <section className="bg-white">
//       <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
//         <h2 className="text-2xl font-bold mb-4 capitalize">
//           {category ? category.replace("-", " ") : "All Products"}
//         </h2>

//         {/* Filtered Products */}
//         {loading ? (
//           <Loader />
//         ) : error ? (
//           <Message variant="danger">{error}</Message>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
//             {products &&
//               products
//                 .filter((product) => 
//                   product.category &&
//                   product.category.toLowerCase().replace(/\s+/g, "-") === category
//                 )
//                 .map((product) => (
//                   <Product key={product._id} product={product} />
//                 ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default CategoryScreen;