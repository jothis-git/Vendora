import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 👈 For names/images
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getFallbackImage = (categoryId) => {
    switch(categoryId) {
      case 1: return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800';
      case 2: return 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800';
      case 3: return 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800';
      case 4: return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Orders
        const ordersRes = await api.get("/api/orders");
        let sortedOrders = [];
        if (Array.isArray(ordersRes.data)) {
          // Sort by newest first (descending)
          sortedOrders = ordersRes.data.sort((a, b) => 
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          );
        }
        setOrders(sortedOrders);

        // 2. Fetch All Products (Safe way to get names/images)
        const productsRes = await api.get("/api/products");
        setAllProducts(Array.isArray(productsRes.data) ? productsRes.data : []);

      } catch (error) {
        console.error("Fetch history failed:", error);
        toast.error("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // Helper to find product details by ID (Type-Resilient)
  const getProductInfo = (id) => {
    if (!id) return {};
    return allProducts.find(p => 
      String(p.product_id) === String(id) || 
      String(p.productId) === String(id) || 
      String(p.id) === String(id) ||
      String(p._id) === String(id)
    ) || {};
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-bold text-gray-400 uppercase tracking-widest animate-pulse">Please login to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase italic">My History</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Track and manage your order journey</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full shadow-lg"></div>
            <p className="text-gray-400 font-bold animate-pulse text-[10px] uppercase tracking-widest">Compiling Data...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-gray-100 px-6 mb-8">
              <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner italic">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
              <p className="text-gray-500 mb-10 text-lg">Your order list is empty. Start shopping to fill it up!</p>
              <button 
                onClick={() => window.location.href='/products'}
                className="bg-gray-900 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
              >
                Go Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order.orderId || Math.random()} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                {/* Header Side */}
                <div className="bg-white p-6 sm:p-7 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Order ID</p>
                      <p className="text-gray-900 font-black text-sm tracking-tighter uppercase">
                         <span className="text-orange-500 mr-1">#</span>{order.orderId.substring(0, 10)}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-gray-100 hidden sm:block"></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Placed On</p>
                      <p className="text-gray-900 font-bold text-base">
                        {order.createdAt ? 
                          new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) 
                          : "Processing..."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 sm:gap-10">
                    <div className="hidden lg:block text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          (order.status === 'SUCCESS' || order.status === 'DELIVERED') ? 'bg-green-500' : 'bg-orange-500'
                        }`}></span>
                        <span className="text-gray-900 font-black text-[10px] uppercase tracking-tighter">{order.status || 'Pending'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payment Total</p>
                      <p className="text-2xl font-black text-orange-600">₹{order.totalAmount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Items Side */}
                <div className="p-6 sm:p-7 bg-gray-50/30">
                  <div className="grid gap-4">
                    {/* Check both orderItems and items for compatibility with all order states */}
                    {(order.orderItems || order.items || []).length > 0 ? (
                      (order.orderItems || order.items).map((item, idx) => {
                        const lookupId = item.productId || item.product_id || item.id;
                        const productInfo = getProductInfo(lookupId);
                        const image = productInfo.images?.[0] || item.images?.[0] || getFallbackImage(productInfo.category_id || item.category_id);
                        
                        return (
                          <div key={idx} className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow group/item">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                              <img 
                                src={image} 
                                alt={productInfo.name || "Product"}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform"
                                onError={(e) => e.target.src = getFallbackImage(productInfo.category_id || item.category_id)}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-base truncate group-hover/item:text-orange-600 transition-colors uppercase italic">
                                {productInfo.name || item.productName || item.name || `Product #${lookupId}`}
                              </h4>
                              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                                Count: <span className="text-gray-900 font-black">{item.quantity}</span>
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-black text-lg text-gray-900">₹{(item.quantity * (item.pricePerUnit || 0)) || 0}</p>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">₹{item.pricePerUnit || 0} / unit</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-gray-400 py-4 italic text-sm">No items found.</p>
                    )}
                  </div>
                </div>

                {/* Footer / Expandable Details */}
                <div className="border-t border-gray-50 bg-white">
                  <div className="px-6 py-4 flex justify-between items-center">
                    <button 
                      onClick={() => toggleOrder(order.orderId)}
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-2"
                    >
                      {expandedOrderId === order.orderId ? 'Hide History ↑' : 'View Full Details ↓'}
                    </button>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Transaction Verified</span>
                  </div>
                  
                  {expandedOrderId === order.orderId && (
                    <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
                         <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">Order Hash</span>
                            <span className="text-gray-600 font-mono font-bold select-all">{order.orderId}</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">Timestamp</span>
                            <span className="text-gray-600 font-bold uppercase">{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "Recently"}</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">Delivery</span>
                            <span className={`${order.status === 'PENDING' ? 'text-blue-600' : 'text-green-600'} font-black uppercase tracking-tighter`}>
                               {order.status === 'PENDING' ? 'Preparing for dispatch / Payment Verification' : 'Standard Shipping (Out for delivery)'}
                            </span>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
