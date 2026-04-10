import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Offers() {
  const offers = [
    {
      id: 1,
      title: "Summer Mega Sale",
      discount: "Up to 50% OFF",
      description: "Grab the hottest deals of the season on electronics and fashion.",
      code: "SUMMER50",
      bg: "bg-gradient-to-r from-orange-400 to-red-500",
    },
    {
      id: 2,
      title: "New User Welcome",
      discount: "Flat ₹500 OFF",
      description: "Sign up today and get an instant discount on your first order above ₹2000.",
      code: "WELCOME500",
      bg: "bg-gradient-to-r from-blue-400 to-indigo-600",
    },
    {
      id: 3,
      title: "Gadget Bonanza",
      discount: "Extra 10% Cashback",
      description: "Use your credit card and get extra cashback on all electronics.",
      code: "TECH10",
      bg: "bg-gradient-to-r from-emerald-400 to-teal-600",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Exclusive <span className="text-orange-500">Offers</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Unbeatable deals that you just can't miss.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {offers.map((offer) => (
            <div key={offer.id} className={`rounded-3xl p-8 text-white shadow-xl transform transition duration-500 hover:scale-105 ${offer.bg}`}>
              <div className="uppercase tracking-wide text-sm font-bold mb-2 opacity-80">{offer.title}</div>
              <h3 className="text-3xl font-extrabold mb-4">{offer.discount}</h3>
              <p className="mb-8 opacity-90 text-lg">{offer.description}</p>
              <div className="bg-white bg-opacity-20 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
                <span className="font-mono text-xl font-bold tracking-wider">{offer.code}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(offer.code);
                    toast.success("Promo code copied to clipboard!");
                  }}
                  className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
            Start Shopping Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Offers;
