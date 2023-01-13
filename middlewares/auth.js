import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.loginCookie;
    console.log(token);
    const tokenDecoded = jwt.verify(
      token,
      process.env.SECRET_JWT || "thisisoursecretjsonwebtoken"
    );
    console.log({ tokenDecoded });
    req.user = await User.findById(tokenDecoded.userId).select("-password");
    // const { userName } = tokenDecoded;
    // res.send({
    //   message: "Inhalt nur für eingeloggten User",
    // });

    next();
  } catch (err) {
    next(err);
  }
};
export default auth;
