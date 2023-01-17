import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const secret = process.env.SECRET_JWT || "thisisoursecretjsonwebtoken";

const auth = async (req, res, next) => {
  try {
    
    const token = req.cookies.loginCookie;
    console.log(token);

    const decoded = jwt.verify(token, secret);
    console.log(decoded);
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (err) {
    next({ err: err.message });
  }
};
export default auth;
