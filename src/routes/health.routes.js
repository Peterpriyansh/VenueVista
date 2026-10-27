const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // Check database connectivity without returning any database details.
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      data: {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    error.statusCode = 503;
    error.code = "SERVICE_UNAVAILABLE";
    error.message = "The service or database is temporarily unavailable.";
    next(error);
  }
});

module.exports = router;
