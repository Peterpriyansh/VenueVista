const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

module.exports = async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, error: { code: "AUTH_REQUIRED", message: "Please log in to continue." } });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, fullName: true, email: true, role: true, isActive: true } });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: { code: "INVALID_SESSION", message: "This session is no longer valid. Please log in again." } });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Your session expired. Please log in again." } });
  }
};
