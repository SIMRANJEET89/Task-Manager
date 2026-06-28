import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Register.jsx";
import Home from "./component/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OtpVerification from "./pages/OtpVerification.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import bgImage from "./assets/pexels-codioful-7130498.jpg"
import "./App.css";
import Navbar from "./component/Navbar.jsx";
import Calender from "./pages/Calender.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden">

        <img src={bgImage} alt="background"   className="fixed t-0 left-0 -z-10 w-full h-full object-cover"/>

        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/calender" element={ <Calender />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
