import  jwt  from "jsonwebtoken";
import User from "../models/userModel.js";
const verifyPassword = async (req, res, next) => {
    try {
      const token = req.params.token;
      const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
      console.log(decodedToken);
      const id = decodedToken._id;
     const user =  await User.findByIdAndUpdate(id, {
        isVerified: true,
      });
    //  res.redirect("http://localhost:3000/users/setPassword");
  res.status(200).json({message: "verified"})
  next(user)
  } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  };
  export default verifyPassword