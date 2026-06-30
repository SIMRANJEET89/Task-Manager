import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Profile = () => {
  const savedToken = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate()
  const fileInputRef =  useRef(null)

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile?userId=${loggedInUserId}`,
        { name, email, bio },
        { withCredentials: true ,
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        },
      );

      console.log("data here", response);

      if (response.data.success) {
        toast.success("profile saved");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleImagePreview = (e) => {
    const selectEditFile = e.target.files[0];
    if (!selectEditFile) return;

    const previewUrl = URL.createObjectURL(selectEditFile);
    setImage(previewUrl);

    uploadImageToServer(selectEditFile);
  };

  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append('userId', loggedInUserId)
     
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/upload-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${savedToken}`,
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success("Profile picture uploaded");
        fetchProfileData()
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
    }
  };

  const fetchProfileData = async () => {
    try {
      if (!savedToken) {
        console.log("Token not found");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/get-profile?userId=${loggedInUserId}`,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        },
      );
      console.log("mongo data", response.data);

      if (response.data.success) {
        setName(response.data.profile.name || "");
        setEmail(response.data.profile.email || "");
        setBio(response.data.profile.bio || "");

        if (response.data.profile.image) {
          const imgUrl = response.data.profile.image.startsWith('http')
          ? response.data.profile.image :
          `${import.meta.env.VITE_BACKEND_URL}${response.data.profile.image}`;
          setImage(imgUrl)
        }
      }
    } catch (error) {
      console.log("profile not loaded", error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")

      navigate('/login')
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const isLogin = localStorage.getItem("token")

  if (!isLogin) {
    return <Navigate to="/login" replace/>
    
  }


  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <section className="w-full container mx-auto mt-25 px-10 flex justify-center z-0">
      <div className="bg-black/5 backdrop-blur-xs border my-4 border-violet-600  p-4  w-full max-w-lg mx-auto shadow-lg rounded flex justify-center">
        <div>
          <div className="rounded-full w-24 h-24 border border-violet-500 flex justify-center items-center">
            <img
              className="rounded-full"
              src={
                image ||
                'https://www.w3schools.com/howto/img_avatar2.png'
              }
              alt="profile"
            />
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="cursor-pointer text-white border px-3 m-3 rounded bg-gray-600"
          >
            Edit image
          </button>
          <input
            onChange={handleImagePreview}
            type="file"
            ref={fileInputRef}
            hidden
          />
          <div className="mt-8 grid gap-2 w-[300px]">
            <label htmlFor="name">Name :</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="border border-violet-500 p-2 rounded"
            />
            <label htmlFor="email">Email :</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="border border-violet-500 p-2 rounded"
            />
            <label htmlFor="bio">Bio : </label>
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              type="text"
              className="border border-violet-500 py-4 px-1 flex-1 rounded"
            />
          </div>
          <button
            onClick={handleSave}
            className="text-white mt-5 border p-1 px-3 rounded bg-gray-700 m-2"
          >
            Save Changes
          </button>
          <button
            onClick={handleLogout}
          className="text-white mt-5 border p-1 px-3 rounded bg-gray-700 m-2">Logout</button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
