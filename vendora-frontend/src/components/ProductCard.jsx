import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../services/api";

import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useContext(CartContext);

  const getFallbackImage = () => {
    // 1: Electronics, 2: Fashion, 3: Home & Garden, 4: Sports
    switch(product.category_id) {
      case 1: return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800';
      case 2: return 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800';
      case 3: return 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800';
      case 4: return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800';
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
    if (!wishlisted) {
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-4 relative group flex flex-col h-full">

      {/* Wishlist Icon */}
      <button
        onClick={toggleWishlist}
        className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
      >
        {wishlisted ? (
          <FaHeart className="text-red-500 text-xl" />
        ) : (
          <FaRegHeart className="text-gray-400 text-xl hover:text-red-500 transition-colors" />
        )}
      </button>

      {/* Product Image */}
      <Link to={`/products/${product.product_id}`} state={{ product }} className="block overflow-hidden rounded-lg mb-4 flex-shrink-0">
        <img
          src={product.images?.[0] || getFallbackImage()}
          alt={product.name}
          onError={(e) => {
            e.target.src = getFallbackImage();
          }}
          className="h-48 w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <Link to={`/products/${product.product_id}`} state={{ product }} className="block flex-1">
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2 hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description || "High quality product from Vendora"}
        </p>
      </Link>

      {/* Price */}
      <div className="flex items-center justify-between mt-auto">
        <p className="text-orange-500 font-extrabold text-xl">
          ₹{product.price}
        </p>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 text-sm shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;