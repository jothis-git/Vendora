import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <div className="bg-gray-50">
              {/* Hero Section */}
              <div className="text-center py-32 bg-orange-100 px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
                  Welcome to <span className="text-orange-500 block sm:inline mt-2 sm:mt-0">Vendora</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                  Your one-stop destination for the best products online. Discover premium quality items at unbeatable prices.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <button 
                    onClick={() => window.location.href='/products'}
                    className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 hover:shadow-lg transition-all transform hover:-translate-y-1">
                    Start Shopping
                  </button>
                  <button 
                    onClick={() => window.location.href='/offers'}
                    className="bg-white text-orange-600 border border-orange-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
                    View Offers
                  </button>
                </div>
              </div>

              {/* Features Section */}
              <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-4 border-white shadow-sm">🚚</div>
                      <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
                      <p className="text-gray-500">On all orders over ₹999</p>
                    </div>
                    <div className="p-6">
                      <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-4 border-white shadow-sm">🔒</div>
                      <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                      <p className="text-gray-500">100% protected transactions</p>
                    </div>
                    <div className="p-6">
                      <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-4 border-white shadow-sm">↩️</div>
                      <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
                      <p className="text-gray-500">30 days return policy</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } 
        />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route path="/categories" element={<Categories />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

      </Routes>
      
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Footer />
    </div>
  );
}

export default App;