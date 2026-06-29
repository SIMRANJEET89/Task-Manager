import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const [data, setData] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (!savedEmail) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const savedEmail = localStorage.getItem("userEmail");

      const payload = {
        email: savedEmail,
        otp: data,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/otp-verification`,
        payload,

        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("OTP verified");

        setData("");
        navigate("/reset-password");
      }
    } catch (error) {
      console.log(error.response?.data?.message || "otp not verify");
    }
  };

  return (
    <section className="w-full container mx-auto px-8 flex justify-center mt-20">
      <div className="bg-black/10 backdrop-blur-xs border my-4 border-violet-600 p-7  w-full max-w-lg max-auto shadow-lg rounded">
        <p className="text-2xl font-semibold text-violet-700 text-center">
          Enter OTP{" "}
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-cyan-50 grid gap-2 mt-4 p-3"
        >
          <div className="grid gap-1">
            <label htmlFor="otp">Enter your OTP :</label>
            <div className="flex items-center gap-2 justify-between mt-3">
              <input
                type="text"
                onChange={(e) => setData(e.target.value)}
                value={data}
                maxLength={6}
                className="border border-violet-500 bg-violet-300 rounded w-full p-2 mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-violet-400 p-2 rounded-full m-2 border border-violet-600 text-violet-50 text-xl items-center cursor-pointer hover:bg-violet-300"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </section>
  );
};

export default OtpVerification;
