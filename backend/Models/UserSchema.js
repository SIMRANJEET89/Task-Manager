import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, Unique: true },
    bio: { type: String },
    image: { type: String, url: "" },

    password: { type: String, required: true },
    otp: { type: Number },
    otpExpiry: { type: Date, default: "" },
  },
  { timeseries: true },
);

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
