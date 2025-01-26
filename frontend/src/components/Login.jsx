import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../utils/axiosClient";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);

      const result = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      setCookie("accessToken", result.data.accessToken);

      toast.success("Logged In", {
        duration: 3000,
        style: {
          padding: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen px-5 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="p-8 w-100 border border-gray-800 bg-gray-800 rounded-md"
      >
        <div className="text-center text-xl font-medium mb-6">Login</div>

        {errorMessage && (
          <div className="text-red-800 text-sm mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <label htmlFor="email" className="block mb-1">
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="block mb-1">
          Enter your password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-2 rounded mt-10 ${
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className=" mt-5 text-center">
          Don't have an account ?{" "}
          <span
            onClick={() => navigate("/signup")}
            className=" underline text-blue-400 cursor-pointer"
          >
            Sign Up
          </span>{" "}
        </div>
      </form>
    </div>
  );
}

export default Login;
