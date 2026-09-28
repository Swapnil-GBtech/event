import jwt from "jsonwebtoken"

  export const createAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id }, process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
  }