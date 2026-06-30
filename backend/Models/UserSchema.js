import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String, default: "" },

    password: { type: String, required: true },
    otp: { type: Number },
    otpExpiry: { type: Date, default: "" },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);

export default UserModel;
