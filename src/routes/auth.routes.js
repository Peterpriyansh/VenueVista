const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../config/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128)
});
const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128)
});
function issueToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    const error = new Error("JWT_SECRET must be set to a random secret of at least 32 characters.");
    error.statusCode = 500;
    throw error;
  }
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d", issuer: "venuevista-api", audience: "venuevista-client" });
}
function safeUser(user) { return { id: user.id, fullName: user.fullName, email: user.email, role: user.role }; }

router.post("/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Enter a name, valid email, and password with at least 8 characters." } });
    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return res.status(409).json({ success: false, error: { code: "EMAIL_EXISTS", message: "An account with this email already exists. Please log in." } });
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({ data: { fullName: parsed.data.fullName, email, passwordHash }, select: { id: true, fullName: true, email: true, role: true } });
    return res.status(201).json({ success: true, data: { user, token: issueToken(user) } });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ success: false, error: { code: "EMAIL_EXISTS", message: "An account with this email already exists." } });
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Enter a valid email and password." } });
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    const matches = user && user.isActive && await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!matches) return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." } });
    return res.json({ success: true, data: { user: safeUser(user), token: issueToken(user) } });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, (req, res) => res.json({ success: true, data: { user: req.user } }));
module.exports = router;
