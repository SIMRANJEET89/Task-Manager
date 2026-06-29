import { useState } from "react";
import { Link} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Login successfully");
        const backEndId =
          response.data.user?._id ||
          response.data.user?.id ||
          response.data._id;

        if (backEndId) {
          localStorage.setItem("userId", backEndId);
        }
        localStorage.setItem("token", response.data.token) 
       
        setEmail("");
        setPassword("");

        window.location.href = "/"; 
       
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Login faild");
    }
  };

  return (
    <section className="w-full container mx-auto mt-25 px-10 flex justify-center">
      <div className="bg-black/10 backdrop-blur-xs border my-4 border-violet-600  p-7  w-full max-w-lg mx-auto shadow-lg rounded">
        <p className="text-2xl font-semibold text-violet-700  text-center">
          Login here
        </p>
        <form
          onSubmit={handleLogin}
          action=""
          className="bg-cyan-50 grid gap-2 mt-4 p-3"
        >
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-violet-500 bg-violet-300  rounded w-full p-2 mt-1"
              placeholder="Enter your Email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-violet-500 bg-violet-300 rounded w-full p-2 mt-1"
              placeholder="Enter your Password"
            />
          </div>
          <button
            className="bg-violet-300 p-2 md:px-6 md:py-3 rounded-full m-2 border border-violet-600 text-sm md:text-xl items-center cursor-pointer hover:bg-purple-400 "
          >
            Submit
          </button>
          <p className="text-sm">
            Didn't have an account ?{" "}
            <Link
              to="/register"
              className="text-violet-800 underline cursor-pointer text-sm"
            >
              Register
            </Link>
            <Link
              className="ml-8 text-gray-700 font-medium cursor-pointer"
              to="/forgot-password"
            >
              Forgot Password
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
