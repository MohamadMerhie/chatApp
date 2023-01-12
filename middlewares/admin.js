import usersModel from "../models/usersModel.js";

const admin = async (req, res, next) => {
  try {
    const user = await usersModel.findById(req.token.userId);
    if (!user.isAdmin) {
      const error = new Error("You have no access ");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
export default admin;
