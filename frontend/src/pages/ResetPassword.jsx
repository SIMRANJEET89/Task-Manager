import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  const handelPassword = async (e) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        toast.error("New Password and Confirm Password must be same");
        return;
      }

      const response = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
        { email: email, password: password, confirmPassword: confirmPassword },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("New Password generated successfully");

        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <section className="w-full container mx-auto px-5 flex justify-center mt-25">
      <div className="bg-black/10 backdrop-blur-xs border my-4 border-violet-600 p-7  w-full max-w-lg mx-auto shadow-lg rounded">
        <p className="text-2xl font-semibold text-violet-700 text-center">
          New Password
        </p>

        <form
          onSubmit={handelPassword}
          action=""
          className="bg-cyan-50 grid gap-2 mt-4 p-3"
        >
          <div className="grid gap-1">
            <label htmlFor="password">New Password</label>
            <input
              type="text"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-violet-500 bg-violet-300 rounded w-full p-2 mt-1"
              placeholder="Enter your Password"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm-Password</label>
            <input
              type="text"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="border border-violet-500 bg-violet-300 rounded w-full p-2 mt-1"
              placeholder="Enter your Confirm-Password"
            />
          </div>
          <button
            type="submit"
            className="bg-violet-300 p-2 md:px-6 md:py-3 rounded-full m-2 border border-violet-600 text-sm md:text-xl items-center cursor-pointer hover:bg-purple-400 "
          >
            Reset Password
          </button>
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-800 underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
