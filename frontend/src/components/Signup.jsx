import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../utils/axiosClient";

function Signup() {
  const [email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setErrorMessage("");
      setLoading(true);
      const res = await axiosClient.post("/auth/signup", {
        Name,
        email,
        password,
      });
      console.log("res", res);
      toast.success("You are Signed Up", {
        duration: 4000,
        style: {
          padding: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to signup. Please try again.");
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
        <div className="text-center text-xl font-medium mb-10">Sign Up</div>

        {errorMessage && (
          <div className="text-red-800 text-sm mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <label htmlFor="">Enter your name</label>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mt-2 mb-2"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="">Enter your email</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mt-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="">Enter your password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mt-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="">Confirm password</label>
        <input
          type="password"
          placeholder="Re-enter Password"
          className="w-full p-2 border rounded mt-2 mb-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-2 rounded mt-10 ${
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Signup"}
        </button>
        <div className=" mt-5 text-center">
          Already Registered ?{" "}
          <span
            onClick={() => navigate("/login")}
            className=" underline text-blue-400 cursor-pointer"
          >
            Login
          </span>{" "}
        </div>
      </form>
    </div>
  );
}

export default Signup;
