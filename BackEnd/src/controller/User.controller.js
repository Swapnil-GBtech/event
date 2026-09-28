import { User } from "../models/User.model.js";
import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import ApiError from "../utils/ApiError/ApiError.js";
import { createAccessToken } from "../utils/AccessToken/AccessToken.js";
import { createRefreshToken } from "../utils/RefreshToken/RefreshToken.js";
import { generateOTP } from "../utils/GenrateOtp/genrateOtp.js";
import { sendOtpToMail } from "../utils/Nodemailer/NodeMailer.js";

import bcrypt from "bcrypt";

export const registerUser = asynchandler(async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      organization,
      subscriptionType,
      price,
      phone,
      address,
    } = req.body;

    console.log("req.body", req.body);

    if (!name || !email || !password || !role || !phone || !address) {
      throw new ApiError(400, "All fields are required");
    }

    const organizationId = req.user._id;
    console.log("organizationId", organizationId);

    if (
      (role === "admin" || role === "super Admin") &&
      (!organization || !subscriptionType || !price)
    ) {
      throw new ApiError(
        400,
        "Organization, subscriptionType & price are required for admin users"
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date();
    let expiryDate = null;
    let dayremaining = 0;
    let monthName = now.toLocaleString("default", { month: "long" });
    let amount = price;

    // Subscription handling
    if (role === "admin" || role === "super Admin") {
      if (subscriptionType === "Monthly") {
        expiryDate = new Date(now);
        expiryDate.setMonth(expiryDate.getMonth() + 1); // add 1 month
        amount;
      } else if (subscriptionType === "Yearly") {
        expiryDate = new Date(now);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // add 1 year
        amount;
      } else if (subscriptionType === "demo") {
        expiryDate = new Date(now);
        expiryDate.setDate(expiryDate.getDate() + 7); // 7-day demo
        amount;
      }

      // Calculate day remaining
      const diffInMs = expiryDate - now;
      dayremaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      createdBy: organizationId,
    };

    if (role === "admin" || role === "super Admin") {
      userData.role = role;
      userData.organization = organization;
      userData.subscriptionType = subscriptionType;
      userData.status = "Active";
      userData.expiryDate = expiryDate;
      userData.dayremaining = dayremaining;
      userData.monthName = monthName;
      userData.price = amount;
    }

    const newUser = await User.create(userData);

    await sendOtpToMail({
      email: newUser.email,
      subject: "Your Password for Event Login",
      message: `Dear user, your PASSWORD for login is: ${password}`,
      password: password,
      type: "password",
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { newUser, email },
          "Your password has been sent to your email."
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const getAllOrganizer = asynchandler(async (req, res) => {
  try {
    const getAllOrganizer = await User.find({ role: "organizer" });
    if (!getAllOrganizer) {
      throw new ApiError(400, "Organizer not found");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(201, getAllOrganizer, "Organizer found successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});



export const loginUser = asynchandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️ Validate input
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    // 2️ Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "please chek your email");
    }

    // 3️ Check password
    if (user.role === "super Admin") {
      if (password !== user.password) {
        throw new ApiError(400, "Invalid password");
      }
    } else {
      // For regular users: hashed password check
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new ApiError(400, "Incorrect password");
      }
    }

    // 4️ Generate OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // 5️ Send OTP email
    await sendOtpToMail({
      email: user.email,
      subject: "Your OTP for Event Login",
      message: `Dear user, your OTP for login is: ${otp}. It is valid for 5 minutes.`,
      otp,
      type: "login",
    });

    // 6️ Respond
    return res
      .status(200)
      .json(
        new ApiResponse(200, { email }, "OTP sent successfully to your email")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});



export const EditUser = asynchandler(async (req, res) => {
  try {
    const { name, email, phone, address, role, userId, organizationId } =
      req.body;

    const user = await User.findOne({ _id: userId, createdBy: organizationId });
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    // Update only if values are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (role) user.role = role;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const deleteUser = asynchandler(async (req, res) => {
  try {
    const { organizationId, userId } = req.query;
    if (!organizationId || !userId) {
      throw new ApiError(400, "UserIds not found");
    }
    const user = await User.findOne({ _id: userId, createdBy: organizationId });
    if (!user) {
      throw new ApiError(400, "User not found");
    }

       
    if (req.user.role !== "admin") {
      throw new ApiError(400, "Only Admin User deleted to any user");
    }
    const DeletedUser = await User.deleteOne({ _id: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, DeletedUser, "User deleted successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const deleteAdmin = asynchandler(async (req, res) => {
     try {
       const {organizaionId,userID} = req.query;
       console.log(organizaionId,userID)
       if(!organizaionId || !userID){
          throw new ApiError(400, "UserIds not found");
       }

       const user = await User.findOne({ _id: userID, createdBy: organizaionId,role:"admin" });
       if (!user) {
         throw new ApiError(400, "User not found");
       }
 
       
       if (req.user.role !== "super Admin") {
         throw new ApiError(400, "Only Admin User deleted to any user");
       }
       const DeletedUser = await User.deleteOne({ _id: userID });
       return res
         .status(200)
         .json(new ApiResponse(200, DeletedUser, "User deleted successfully"));

     } catch (error) {
        throw new ApiError(400, error.message)
     }
})

export const logoutUser = asynchandler(async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json(new ApiResponse(201, null, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

export const getprofile = asynchandler(async (req, res) => {
  try {
    const user = req.user;
    const authenticatedUser = await User.findById(user._id)
      .populate({
        path: "favorate_events",
        populate: [{ path: "Category" }, { path: "Organizer" }],
      })
      .populate("registered_attendees");
    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          authenticatedUser,
          "User profile fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const getAllUsers = asynchandler(async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      throw new ApiError(400, "You are not authorized to access this route");
    }
    const getAllUsers = await User.find();
    return res
      .status(201)
      .json(new ApiResponse(201, getAllUsers, "Users fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const toggleFavorite = asynchandler(async (req, res) => {
  try {
    const { eventId } = req.query;
    const user = req.user;

    // Check if user is attendee
    if (user.role !== "attendee") {
      throw new ApiError(403, "Only attendees can manage favorite events");
    }

    // Fetch user from DB to get the latest favorate_events
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }

    const alreadyFavorited = existingUser.favorate_events.includes(eventId);

    let updatedUser;

    if (alreadyFavorited) {
      // Remove from favorites
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { favorate_events: eventId } },
        { new: true }
      );
    } else {
      // Add to favorites
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { favorate_events: eventId } },
        { new: true }
      ).populate({ path: "favorate_events" });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          alreadyFavorited
            ? "Event removed from favorites"
            : "Event added to favorites"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const EditUserProfile = asynchandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, email, password },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "User profile updated successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});



export const refreshAccessToken = asynchandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized: No refresh token found");
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const newAccessToken = createAccessToken(user);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken },
          "Access token refreshed"
        )
      );
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

export const verifyOtp = asynchandler(async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");
    if (
      user.otp !== otp ||
      !user.otpExpiry ||
      new Date(user.otpExpiry).getTime() < Date.now()
    ) {
      throw new ApiError(400, "Invalid or expired OTP");
    }
    //  OTP is valid
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const acessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("role", user.role, {
  httpOnly: false, // Accessible in middleware & browser
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});
    return res
      .status(200)
      .json(new ApiResponse(200, { user, acessToken }, "Login successful"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const resendOtp = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpToMail({ email: user.email, otp, type: "" });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "New OTP has been sent to your email"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const Emailvarification = asynchandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "Please Enter Valid Email");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Email varification Successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const changePassword = asynchandler(async (req, res) => {
  try {
    const { email, newpassword, confirmPassword } = req.body;

    // 1. Input validation
    if (!email || !newpassword || !confirmPassword) {
      throw new ApiError(400, "All fields are required");
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 3. Confirm password match
    if (newpassword !== confirmPassword) {
      throw new ApiError(400, "Password and confirm password do not match");
    }

    // 4. Direct password assignment only for super admin
    if (user.role === "super Admin") {
      user.password = newpassword; // ⚠️ This assumes password will be hashed in a pre-save hook
      await user.save();
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Password changed successfully"));
    }

    // 5. Hash password for regular users
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});


export const getAllAdmins = asynchandler(async (req, res) => {
  try {
    const getAllAdmins = await User.find({ role: "admin" });

    if (!getAllAdmins || getAllAdmins.length === 0) {
      throw new ApiError(400, "Admin not found");
    }

    const currentDate = new Date();

    // Calculate remaining days dynamically
    const adminsWithRemainingDays = getAllAdmins.map((admin) => {
      const expiryDate = new Date(admin.expiryDate);
      const timeDiff = expiryDate - currentDate; // in milliseconds
      const remainingDays = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // avoid negative values

      return {
        ...admin._doc, // spread MongoDB document data
        dayremaining: remainingDays, // dynamically calculated
      };
    });

    return res
      .status(201)
      .json(new ApiResponse(201, adminsWithRemainingDays, "Admin found successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});



export const subscriptionStatus = asynchandler(async (req, res) => {
  try {
    const { userID, status } = req.body;

    if (!userID) {
      throw new ApiError(400, "UserId not found");
    }

    const user = await User.findById(userID);
    user.status = status;
    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user },
          "Subscription status updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});


export const getOrganizerAndAttendee = asynchandler(async (req, res) => {
  try {
    const { organizaionId } = req.query;
    if (!organizaionId) {
      throw new ApiError(400, "OrganizerId not found");
    }
    const Users = await User.find({
      createdBy: organizaionId,
      role: { $in: ["organizer", "attendee"] },
    });

    if (!Users) {
      throw new ApiError(400, "Users not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { Users }, "Organizer found successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});




export const updateOrganizerStatus = asynchandler(async (req, res) => {
      try {
         const {organizaionId,userId,status} = req.body;

         if(!organizaionId || !userId || !status){
            throw new ApiError(400, "All fields are required");
         }
         
         const user = await User.findOne({_id:userId,createdBy:organizaionId});
          if(!user){
            throw new ApiError(400, "User not found");
          }

          user.status = status;
          await user.save();
          return res
            .status(200)
            .json(new ApiResponse(200, { user }, "User status updated successfully"));

      } catch (error) {
         throw new ApiError(400, error.message)
      }
})


export const getUserById = asynchandler(async (req, res) => {
  try {
     const { organizationId, userId } = req.query;
     if (!userId) {
       throw new ApiError(400, "userId is required");
     }
     const user = await User.findById({_id:organizationId,createdBy:userId});
     if (!user) {
       throw new ApiError(400, "User not found");
     }
     return res
       .status(200)
       .json(new ApiResponse(200, { user }, "User found successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});
