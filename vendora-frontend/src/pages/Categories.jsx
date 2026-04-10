import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    { id: 1, name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Home & Garden", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Shop by <span className="text-orange-500">Category</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Discover a wide variety of products tailored just for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 z-10"></div>
            <img src={category.image} alt={category.name} className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-md">{category.name}</h3>
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-orange-500 hover:text-white">
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
