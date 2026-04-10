import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(data);
      toast.success("Login successful");
      if (userData?.role === 'ADMIN') {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Invalid username or password";
      toast.error(errorMessage);
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md w-80 rounded"
      >

        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setData({ ...data, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-orange-500 text-white w-full p-2 rounded"
        >
          Login
        </button>

      </form>

    </div>

  );
}

export default Login;