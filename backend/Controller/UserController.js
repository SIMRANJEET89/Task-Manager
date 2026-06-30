import UserModel from "../Models/UserSchema.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../Config/sendEmail.js";
import TaskModel from "../Models/TaskSchema.js";
import ProfileModel from "../Models/ProfileSchema.js";

// Login page controller

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide Email and Password",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist. Please register first ",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWR_SECRET || "123simran",
    );

    return res
      .status(200)
      .cookie("refreshToken", token, { httpOnly: true, secure: false })
      .json({
        success: true,
        message: "Login Successfull",
        token: token,
        user: { id: user._id, email: user.email },
      });
  } catch (error) {
    res.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// register user

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation check
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user already exists or not
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already have acc",
      });
    }

    // password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  create new user in database
    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // send success response(without password or undifind token)
    return res.json({
      success: true,
      message: "Register user successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "server error", error: error.message });
  }
};

// forgot password
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist. Please register first ",
      });
    }

    // otp generate
    const otp = Math.floor(100000 + Math.random() * 90000);
    const expireTime = new Date().getTime() + 60 * 60 * 1000;

    const otpverified = await UserModel.findOneAndUpdate(
      user._id,
      {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expireTime).toISOString(),
      },
      { new: true },
    );

    await sendEmail({
      sendTo: email,
      subject: "My-task- Password Reset OTP",
      html: `<h3>Hello ${
        user.name || "User"
      }, </h3>  <p>Your OTP for resetting the password is <b>${otp}</b></p>
               <p>This OTP is valid for 1 hour</p>`,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong on the server",
    });
  }
};

// otp verification
const OtpVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("req.body is : ", req?.body);

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    const currentTime = new Date();
    if (currentTime > user.expireTime) {
      return res.json({
        success: false,
        message: "OTP Expired, Send again",
      });
    }

    user.otp = null;
    user.expireTime = null;
    await user.save();

    return res.json({
      success: true,
      message: "otp verify successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// reset-password (generate new password)
const NewPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.json({
        success: false,
        message: "Please fill all feilds",
      });
    }
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "New password and confirm password must be same",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return res.json({ message: "User not register" });
    }
    return res.json({
      success: true,
      message: "Password Successfully changed",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// for createTask
const createTask = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const NewTask = await TaskModel.create({
      title: title,
      description: description,
      user: userId,
    });

    return res.json({
      success: true,
      message: "Task added",
      Task: NewTask,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// for getTask
const getTask = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.json({
        success: false,
        tasks: [],
        message: "User not found",
      });
    }
    const tasks = await TaskModel.find({ user: userId });

    if (tasks.length === 0) {
      return res.json({
        success: true,
        tasks: [],
        message: "Task not created yet",
      });
    }
    return res.json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// for updateTask
const updateTask = async (req, res) => {
  try {
    const { _id, title, description, isCompleted } = req.body;

    if (!_id) {
      return res.json({
        success: false,
        message: "Task Id is required",
      });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      { _id: _id },
      { title, description, isCompleted },
      { returnDocument: "after" },
    );

    if (!updatedTask) {
      return res.json({
        success: false,
        message: "Task not found",
      });
    }

    return res.json({
      success: true,
      message: "Task Updated Successfully",
      updatedTask: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// for deleteTask
const deleteTask = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log("this from delete", _id);

    const deleteTask = await TaskModel.findByIdAndDelete(_id);

    return res.json({
      success: true,
      message: "Task delete successfully",
      deleteTask: deleteTask,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// for get profile data

const getProfile = async (req,res) => {
  try {
     const { userId } = req.query;


  if (!userId) {
    return res.json({
      success : false,
      message : 'User Id Not Found'
    })
  }

  const profile = await UserModel.findById( userId);

  if (profile) {
    return res.json({
      success : true,
      message : 'profile match',
      profile
    })
    
  } 
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
 
}

//for updateprofile data
const updateProfile = async (req,res) => {
  try {
    const {userId} = req.query
    const {name, email, bio} = req.body;

    if (!userId || !name || !email) {
      return res.json({
        success : false,
        message : 'data not found'
      })
      
    }

    const profileUpdate = await UserModel.findByIdAndUpdate(userId, {name, email, bio}, {returnDocument : "after"})

    return res.json({
      success : true,
      message : 'profile updated',
      profileUpdate
    })
    
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  
  }
}

// for upload profile image
const uploadAvatar = async (req,res) => {
  try {
    const {userId} = req.body.userId;

    if (!req.file) {
      return res.json({
        success : false,
        message: 'No image file Uploaded'
      })
      
    }

    const imagePath = req.file.path;

    const profileUpdated = await UserModel.findByIdAndUpdate(userId,
    {image : imagePath},
    {returnDocument : 'after'}
    )

    return res.json({
      success : true,
      message : 'Profile Image uploaded successfully',
      profileUpdated

    })
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export {
  LoginUser,
  RegisterUser,
  ForgotPassword,
  OtpVerification,
  NewPassword,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getProfile,
  updateProfile,
  uploadAvatar
};
