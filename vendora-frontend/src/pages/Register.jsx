import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

import logo from "../assets/logo.png";
import shopping from "../assets/shopping.png";

function Register() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      await api.post("/api/users/register", form);

      toast.success("Registration successful");

      navigate("/login");
      
    }

    catch (error) {

      console.error(error);

      if (error.response && error.response.data) {

        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed";

        toast.error(message);

      } else {

        toast.error("Server not reachable");

      }

    }

  };

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Main Section */}

      <div className="grid grid-cols-2 gap-10 px-20 py-16">


        {/* Left Promo Section */}

        <div>

          <p className="text-gray-500">
            Create Your Account
          </p>

          <h1 className="text-5xl font-bold mt-2 leading-tight">

            Shop Smarter <br/>

            with <span className="text-orange-500">Vendora</span>

          </h1>

          <p className="text-gray-500 mt-4">
            Join us and get the best deals!
          </p>

          <div className="mt-6 space-y-2 text-gray-600">

            <p>🚚 Fast Delivery</p>
            <p>🔒 Secure Payment</p>
            <p>🎧 24/7 Support</p>

          </div>

          <img
            src={shopping}
            className="mt-10 w-96"
          />

        </div>



        {/* Registration Form */}

        <div className="bg-white p-10 rounded-xl shadow-md">

          <h2 className="text-3xl font-bold mb-2">
            Register Now
          </h2>

          <p className="text-gray-500 mb-6">
            Fill in your details to create an account
          </p>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Username */}

            <div>

              <label className="block text-sm mb-1">
                Username
              </label>

              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

            </div>


            {/* Email */}

            <div>

              <label className="block text-sm mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

            </div>


            {/* Role Dropdown */}

            <div>

              <label className="block text-sm mb-1">
                Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >

                <option value="CUSTOMER">
                  Customer
                </option>

                <option value="ADMIN">
                  Admin
                </option>

              </select>

            </div>


            {/* Password */}

            <div>

              <label className="block text-sm mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

            </div>


            {/* Confirm Password */}

            <div>

              <label className="block text-sm mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

            </div>


            {/* Terms */}

            <div className="flex items-center gap-2 text-sm">

              <input 
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              
              />

              <span>

                I agree to the

                <span className="text-orange-500 ml-1">
                  Terms & Privacy Policy
                </span>

              </span>

            </div>


            {/* Submit */}

           <button
              disabled={!agreed}
              className={`w-full py-3 rounded-lg mt-3 text-white
              ${agreed ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Create Account
            </button>


            {/* Login link */}

            <p className="text-center text-sm mt-4">

              Already have an account?

              <Link
                to="/login"
                className="text-orange-500 ml-1"
              >
                Login
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Register;