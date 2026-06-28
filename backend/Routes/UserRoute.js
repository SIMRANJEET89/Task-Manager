import express from "express";
import authUser from "../Middleware/authUser.js";
import {
  createTask,
  deleteTask,
  ForgotPassword,
  getProfile,
  getTask,
  LoginUser,
  NewPassword,
  OtpVerification,
  RegisterUser,
  updateProfile,
  updateTask,
  uploadAvatar,
} from "../Controller/UserController.js";
import upload from "../Middleware/multer.js";

const UserRouter = express.Router();

UserRouter.post("/login", LoginUser);
UserRouter.post("/register", RegisterUser);
UserRouter.post("/forgot-password", ForgotPassword);
UserRouter.post("/otp-verification", OtpVerification);
UserRouter.post("/reset-password", NewPassword);
UserRouter.post("/create-task", createTask);
UserRouter.get("/get-task", getTask);
UserRouter.put("/update-task", updateTask);
UserRouter.delete("/delete-task", deleteTask);
UserRouter.get("/get-profile", getProfile);
UserRouter.put("/update-profile", updateProfile);
UserRouter.post("/upload-avatar", upload.single("image"), uploadAvatar);

export default UserRouter;
