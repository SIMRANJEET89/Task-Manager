import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleOTP = async (e) => {
    e.preventDefault();

    if (email) {
      localStorage.setItem("userEmail", email);
    } else {
      toast.error("Please Type Email");
      return;
    }

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/user/forgot-password`,
        { email },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("OTP sent successfully");
        navigate("/otp-verification");
      }
    } catch (error) {
      console.log(error.response?.data?.message || "otp not send");
    }
  };

  return (
    <section className="w-full container mx-auto px-5 flex justify-center mt-20">
      <div className="bg-black/10 backdrop-blur-xs border my-4 border-violet-600 p-7  w-full max-w-lg max-auto shadow-lg rounded">
        <p className="text-2xl font-semibold text-violet-700 text-center">
          Forgot Password
        </p>

        <form
          onSubmit={handleOTP}
          action=""
          className="bg-cyan-50 grid gap-2 mt-4 p-3"
        >
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              className="border border-violet-500 bg-violet-300 rounded w-full p-2 mt-1"
              placeholder="Enter your Email"
            />
          </div>

          <button
            type="submit"
            className="bg-violet-400 p-2 rounded-full m-2 border border-violet-600 text-violet-50 text-xl items-center cursor-pointer hover:bg-violet-300"
          >
            Send OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
