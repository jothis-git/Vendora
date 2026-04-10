import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api, { createPaymentOrder, verifyPayment } from "../services/api";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await api.get("/api/products");
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch products for cart details:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Helper to find product details by ID (Type-Resilient) - Identical to Orders.jsx
  const getProductInfo = (id) => {
    if (!id) return {};
    return allProducts.find(p => 
      String(p.product_id) === String(id) || 
      String(p.productId) === String(id) || 
      String(p.id) === String(id) ||
      String(p._id) === String(id)
    ) || {};
  };

  const getFallbackImage = (categoryId) => {
    switch (categoryId) {
      case 1: return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800';
      case 2: return 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800';
      case 3: return 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800';
      case 4: return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800';
    }
  };

  // ✅ FIXED subtotal
  const subtotal = cart.reduce(
    (acc, item) => {
      const info = getProductInfo(item.product_id || item.productId || item.id);
      const price = info.price || item.price || item.product?.price || 0;
      return acc + (price * item.quantity);
    },
    0
  );

  const total = subtotal - discount;

  const applyPromoCode = () => {
    if (promoCode === "SUMMER50") {
      setDiscount(subtotal * 0.5);
      toast.success("Promo code applied successfully!");
    } else if (promoCode === "WELCOME500") {
      setDiscount(500);
      toast.success("Promo code applied successfully!");
    } else if (promoCode === "TECH10") {
      setDiscount(subtotal * 0.1);
      toast.success("Promo code applied successfully!");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // 1. Prepare cart items for backend
      const cartItems = cart.map((item) => {
        const info = getProductInfo(item.product_id || item.productId || item.id);
        return {
          productId: item.product_id || item.productId || item.id,
          quantity: item.quantity,
          price: info.price || item.price || item.product?.price || 0,
        };
      });

      // 2. Create Razorpay Order on backend
      const orderResponse = await createPaymentOrder({
        totalAmount: total,
        cartItems: cartItems,
      });

      const razorpayOrderId = orderResponse.data;

      // 3. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID",
        amount: Math.round(total * 100), // Razorpay expects amount in paise
        currency: "INR",
        name: "Vendora",
        description: "Shopping Cart Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 4. Verify Payment on backend
            await verifyPayment({
              razorpayOrderId: razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success("Payment successful! Your order has been placed.");
            clearCart();   // ✅ Clear the cart from state and localStorage
            navigate("/orders"); // ✅ Take them to their order history
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Customer Name", // Should ideally come from user profile
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F97316", // Tailwind orange-500
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  if (productsLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Cart Details...</p>
      </div>
    );
  }
  if (user?.role === "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-gray-50 m-10 rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Access Restricted</h2>
        <p className="text-gray-500 text-lg">Please log in to a customer role for shopping and cart.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
          <Link
            to="/products"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="space-y-6">

            {cart.map((item, index) => {

              const productId = item.product_id || item.productId || item.id;
              const info = getProductInfo(productId);
              
              const name = info.name || item.name || item.product?.name || `Product #${productId}`;
              const price = info.price || item.price || item.product?.price || 0;
              const image = info.images?.[0] || item.images?.[0] || getFallbackImage(info.category_id || item.category_id);

              return (
                <div
                  key={productId || index}
                  className="flex items-center gap-6 p-4 border rounded-lg"
                >

                  {/* ✅ IMAGE FIX */}
                  <img
                    src={image}
                    className="h-24 w-24 object-cover rounded-md"
                    alt={name}
                    onError={(e) => {
                      e.target.src = getFallbackImage(info.category_id || item.category_id);
                    }}
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">
                      {name}
                    </h2>

                    {/* ✅ PRICE FIX */}
                    <p className="text-orange-500 font-semibold mt-1">
                      ₹{price}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="bg-gray-100 w-8 h-8 rounded-full"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(productId, item.quantity + 1)
                        }
                        className="bg-gray-100 w-8 h-8 rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-3">

                    {/* ✅ TOTAL FIX */}
                    <p className="font-bold text-lg">
                      ₹{price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 pt-8 border-t flex justify-between">
            <div>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="border px-4 py-2 rounded"
              />
              <button
                onClick={applyPromoCode}
                className="ml-2 bg-gray-200 px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>

            <div className="text-right">
              <p>Subtotal: ₹{subtotal}</p>

              {discount > 0 && (
                <p className="text-green-500">-₹{discount}</p>
              )}

              <h2 className="text-2xl font-bold">
                ₹{total > 0 ? total : 0}
              </h2>

              <button
                onClick={clearCart}
                className="mt-4 mr-4 text-gray-500 hover:text-red-500 underline text-sm"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`mt-4 w-full bg-black text-white px-6 py-3 rounded flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                  }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;