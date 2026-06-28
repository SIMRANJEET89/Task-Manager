import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.json({ success: false, message: "Access denied. Please Login" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    res.json({ success: true, message: "token verified" });

    next();
  } catch (error) {
    return res.json({ success: false, message: "access denied" });
  }
};

export default checkAuth;
