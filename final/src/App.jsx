import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import UserLoginScreen from './screens/UserLoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen'
import PaymentMethodScreen from './screens/PaymentMethodScreen'
import OrderListScreen from './screens/Orderlist'; 
import ProductListScreen from './screens/productlist';
import UserListScreen from './screens/UserList';
import PlaceOrderScreen from './screens/PlaceOrder';
import CategoryScreen from './screens/CategoryScreen'; // Import the new CategoryScreen
import WishlistScreen from './screens/WishlistScreen';  // Import WishlistScreen
import SearchScreen from "./screens/SearchScreen";
import AllProductsScreen from './screens/AllProductsScreen'; 


function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <div className="max-w-screen-xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/login" element={<UserLoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/PlaceOrder" element={<PlaceOrderScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
            <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/category/:category" element={<CategoryScreen />} />
            <Route path="/wishlist" element={<WishlistScreen />} /> {/* Add the Wishlist route */}
            <Route path="/search" element={<SearchScreen />} />
          </Routes>
        </div>
      </main>
      <WishlistScreen />
      <CategoryScreen />
      <Footer />
    </Router>
  )
}

export default App
