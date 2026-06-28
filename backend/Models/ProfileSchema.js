import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    name : {type: String, required : true},
    email : { type: String, required: true, unique : true },
    
    
  },
  { timestamps: true },
);

const ProfileModel = mongoose.model("profile", ProfileSchema);

export default ProfileModel;
