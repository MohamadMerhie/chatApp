import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.cookies.loginCookie;
    console.log(token);
    const tokenDecoded = jwt.verify(token, process.env.SECRET_JWT || "SecretJWTKey");
    console.log({ tokenDecoded });
    // const { userName } = tokenDecoded;
    res.send({
      message: "Inhalt nur für eingeloggten User",
    });
    // const vergleich = jwt.verify(token, process.env.JWT);
    // console.log(vergleich);
    // req.token = vergleich;
    next();
  } catch (err) {
    next(err);
  }
};
export default auth;
