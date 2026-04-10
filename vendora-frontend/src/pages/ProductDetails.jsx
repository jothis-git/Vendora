import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Scroll to top when loading a new product page
    window.scrollTo(0, 0);
    
    if (location.state?.product) {
      setProduct(location.state.product);
      setLoading(false);
      return;
    }

    api.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data.product || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        toast.error("Failed to load product details.");
      });
  }, [id, location.state]);

  const getFallbackImage = (categoryId) => {
    switch(categoryId) {
      case 1: return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800';
      case 2: return 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800';
      case 3: return 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800';
      case 4: return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800';
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ ...product, quantity });
      toast.success(`${quantity} item(s) added to cart.`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
    if (!wishlisted) toast.success("Added to wishlist!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="text-orange-500 hover:text-orange-600 font-semibold underline">
          Go back to Products
        </button>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || getFallbackImage(product.category_id);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-orange-500 transition-colors mb-8 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            
            {/* Image Gallery Section */}
            <div className="md:w-1/2 p-6 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100 relative bg-white">
              <button 
                onClick={toggleWishlist}
                className="absolute top-8 right-8 z-10 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
              >
                {wishlisted ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-2xl hover:text-red-500 transition-colors" />
                )}
              </button>
              
              <div className="aspect-w-1 aspect-h-1 w-full rounded-xl overflow-hidden shadow-sm">
                <img
                  src={imageUrl}
                  alt={product.name}
                  onError={(e) => { e.target.src = getFallbackImage(product.category_id) }}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="md:w-1/2 p-6 lg:p-12 flex flex-col">
              
              <div className="mb-2">
                <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-50 px-3 py-1 rounded-full">
                  In Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-4 mb-6">
                <p className="text-4xl font-extrabold text-orange-500">
                  ₹{product.price}
                </p>
                <p className="text-lg text-gray-400 line-through mb-1">
                  ₹{(product.price * 1.2).toFixed(2)}
                </p>
              </div>

              <div className="prose prose-sm sm:prose text-gray-500 mb-8">
                <p className="text-lg leading-relaxed">{product.description || "A premium, high-quality product brought to you exclusively by Vendora."}</p>
              </div>

              {/* Purchase Actions */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white h-14 w-full sm:w-32">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-l-lg transition-colors"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      readOnly
                      className="flex-1 w-full text-center font-bold text-gray-900 focus:outline-none border-none"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 h-14 rounded-lg font-bold text-lg text-white shadow-md transition-all ${
                      product.stock > 0 
                        ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>🛡️</span> 1 Year Warranty
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔄</span> 30 Days Return
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🚚</span> Fast Delivery
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span> 100% Authentic
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;
