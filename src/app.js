const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { NODE_ENV, clientOrigins } = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const bookingRoutes = require("./routes/booking.routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", NODE_ENV === "production" ? 1 : false);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = [
        ...clientOrigins,
        "https://venue-vista-ashen.vercel.app"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "VenueVista API",
      version: "1.0.0",
      environment: NODE_ENV
    }
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/events", require("./routes/events.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

