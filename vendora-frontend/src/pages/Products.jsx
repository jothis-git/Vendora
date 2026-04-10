import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";

function Products() {

  const [products, setProducts] = useState([]);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {

    // Parse the query parameters
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let endpoint = "/api/products";
    if (category) {
      endpoint = `/api/products?category=${encodeURIComponent(category)}`;
    } else if (search) {
      endpoint = `/api/products?search=${encodeURIComponent(search)}`;
    }

    api.get(endpoint)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error(err);
      });

  }, [location.search]);

  if (user?.role === "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-gray-50 m-10 rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Access Restricted</h2>
        <p className="text-gray-500 text-lg">Please log in to a customer role for shopping and cart.</p>
      </div>
    );
  }

  return (

    <div className="p-10">

      <h2 className="text-3xl font-bold mb-6">
        Products
      </h2>

      <div className="grid grid-cols-4 gap-6">

        {products.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))}

      </div>

    </div>
  );
}

export default Products;