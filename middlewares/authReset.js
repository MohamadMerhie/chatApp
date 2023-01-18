import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const authReset = async (req, res, next) => {
  try {
    const token = req.cookies.resetCookie;
    console.log(token);
    const tokenDecoded = jwt.verify(
      token,
      process.env.SECRET_JWT || "thisisoursecretjsonwebtoken"
    );
    // console.log(tokenDecoded._id);
    req.user = await User.findById(tokenDecoded._id);
    // const { userName } = tokenDecoded;
    // res.send({
    //   message: "Inhalt nur für eingeloggten User",
    // });
    next();
  } catch (err) {
    next(err);
  }
};
export default authReset;