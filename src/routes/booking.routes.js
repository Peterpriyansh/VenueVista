
const express = require("express");
const { randomBytes } = require("node:crypto");
const { z } = require("zod");
const prisma = require("../config/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

const createSchema = z.object({
  eventId: z.string().min(1).max(100),
  seats: z.array(z.string().trim().min(1).max(80)).min(1).max(8)
}).refine(v => new Set(v.seats).size === v.seats.length, {
  message: "Duplicate seats are not allowed."
});

const analyticsQuerySchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  eventId: z.string().min(1).max(100).optional()
});

const includeDetails = {
  event: true,
  seats: { select: { id: true, seatCode: true } }
};

function shapeBooking(b) {
  return {
    ...b,
    unitPriceInRupees: b.unitPriceInPaise / 100,
    totalAmountInRupees: b.totalAmountInPaise / 100,
    selectedSeats: b.seats.map(s => s.seatCode)
  };
}

function isAnalyticsRole(role) {
  return role === "ORGANIZER" || role === "ADMIN";
}

function getBucketDate(date, period) {
  const bucket = new Date(date);
  bucket.setUTCHours(0, 0, 0, 0);

  if (period === "weekly") {
    const day = bucket.getUTCDay();
    const daysSinceMonday = (day + 6) % 7;
    bucket.setUTCDate(bucket.getUTCDate() - daysSinceMonday);
  } else if (period === "monthly") {
    bucket.setUTCDate(1);
  }

  return bucket.toISOString().slice(0, 10);
}

// Sales analytics for organizers and admins.
router.get("/analytics", async (req, res, next) => {
  try {
    if (!isAnalyticsRole(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Organizer or admin access is required."
        }
      });
    }

    const parsed = analyticsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid analytics filters.",
          details: parsed.error.issues
        }
      });
    }

    const { period, eventId } = parsed.data;
    const now = new Date();

    // Daily: last 7 days.
    // Weekly: current week and previous 7 weeks.
    // Monthly: current month and previous 11 months.
    const defaultFrom = new Date(now);
    defaultFrom.setUTCHours(0, 0, 0, 0);

    if (period === "daily") {
      defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 6);
    } else if (period === "weekly") {
      const daysSinceMonday = (defaultFrom.getUTCDay() + 6) % 7;
      defaultFrom.setUTCDate(
        defaultFrom.getUTCDate() - daysSinceMonday - 7 * 7
      );
    } else {
      defaultFrom.setUTCDate(1);
      defaultFrom.setUTCMonth(defaultFrom.getUTCMonth() - 11);
    }

    const from = parsed.data.from
      ? new Date(parsed.data.from)
      : defaultFrom;

    const to = parsed.data.to
      ? new Date(parsed.data.to)
      : now;

    if (from > to) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_DATE_RANGE",
          message: "'from' must be before or equal to 'to'."
        }
      });
    }

    // Include the entire selected end date.
    const endExclusive = new Date(to);
    endExclusive.setUTCHours(23, 59, 59, 999);
    endExclusive.setTime(endExclusive.getTime() + 1);

    const eventFilter = {
      ...(req.user.role === "ORGANIZER"
        ? { organizerId: req.user.id }
        : {}),
      ...(eventId ? { id: eventId } : {})
    };

    // Verify that the requested event belongs to this organizer.
    if (eventId) {
      const requestedEvent = await prisma.event.findFirst({
        where: {
          id: eventId,
          ...(req.user.role === "ORGANIZER"
            ? { organizerId: req.user.id }
            : {})
        },
        select: { id: true }
      });

      if (!requestedEvent) {
        return res.status(404).json({
          success: false,
          error: {
            code: "EVENT_NOT_FOUND",
            message: "Event not found or you cannot access its analytics."
          }
        });
      }
    }

    const where = {
      createdAt: {
        gte: from,
        lt: endExclusive
      },
      event: eventFilter
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            organizerId: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    const summary = {
      totalBookings: bookings.length,
      pendingBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      expiredBookings: 0,
      failedPayments: 0,
      successfulPayments: 0,
      totalTicketsBooked: 0,
      confirmedTicketsSold: 0,
      totalRevenueInPaise: 0,
      pendingRevenueInPaise: 0
    };

    const eventStats = new Map();
    const salesBuckets = new Map();

    for (const booking of bookings) {
      if (booking.status === "PENDING") {
        summary.pendingBookings++;
      } else if (booking.status === "CONFIRMED") {
        summary.confirmedBookings++;
      } else if (booking.status === "CANCELLED") {
        summary.cancelledBookings++;
      } else if (booking.status === "EXPIRED") {
        summary.expiredBookings++;
      }

      summary.totalTicketsBooked += booking.quantity;

      if (booking.paymentStatus === "FAILED") {
        summary.failedPayments++;
      }

      const isPaid =
        booking.status === "CONFIRMED" &&
        booking.paymentStatus === "SUCCEEDED";

      if (isPaid) {
        summary.successfulPayments++;
        summary.confirmedTicketsSold += booking.quantity;
        summary.totalRevenueInPaise += booking.totalAmountInPaise;
      } else if (
        booking.status === "PENDING" &&
        booking.paymentStatus === "PENDING"
      ) {
        summary.pendingRevenueInPaise += booking.totalAmountInPaise;
      }

      const eventKey = booking.event.id;

      if (!eventStats.has(eventKey)) {
        eventStats.set(eventKey, {
          eventId: eventKey,
          eventTitle: booking.event.title,
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
          ticketsBooked: 0,
          ticketsSold: 0,
          revenueInPaise: 0,
          pendingRevenueInPaise: 0
        });
      }

      const stats = eventStats.get(eventKey);
      stats.totalBookings++;
      stats.ticketsBooked += booking.quantity;

      if (booking.status === "PENDING") {
        stats.pendingBookings++;
      } else if (booking.status === "CONFIRMED") {
        stats.confirmedBookings++;
      } else if (booking.status === "CANCELLED") {
        stats.cancelledBookings++;
      }

      if (isPaid) {
        stats.ticketsSold += booking.quantity;
        stats.revenueInPaise += booking.totalAmountInPaise;
      } else if (
        booking.status === "PENDING" &&
        booking.paymentStatus === "PENDING"
      ) {
        stats.pendingRevenueInPaise += booking.totalAmountInPaise;
      }

      const bucketDate = getBucketDate(booking.createdAt, period);

      if (!salesBuckets.has(bucketDate)) {
        salesBuckets.set(bucketDate, {
          date: bucketDate,
          bookings: 0,
          ticketsSold: 0,
          revenueInPaise: 0
        });
      }

      const bucket = salesBuckets.get(bucketDate);
      bucket.bookings++;

      if (isPaid) {
        bucket.ticketsSold += booking.quantity;
        bucket.revenueInPaise += booking.totalAmountInPaise;
      }
    }

    const events = Array.from(eventStats.values())
      .map(event => ({
        ...event,
        revenueInRupees: event.revenueInPaise / 100,
        pendingRevenueInRupees:
          event.pendingRevenueInPaise / 100
      }))
      .sort((a, b) => b.revenueInPaise - a.revenueInPaise);

    // Fill missing dates with zero values so the chart has a continuous
    // timeline, even when there are no bookings on some dates.
    const firstBucket = new Date(
      `${getBucketDate(from, period)}T00:00:00.000Z`
    );
    const lastBucket = new Date(
      `${getBucketDate(to, period)}T00:00:00.000Z`
    );

    for (const cursor = new Date(firstBucket); cursor <= lastBucket;) {
      const key = cursor.toISOString().slice(0, 10);

      if (!salesBuckets.has(key)) {
        salesBuckets.set(key, {
          date: key,
          bookings: 0,
          ticketsSold: 0,
          revenueInPaise: 0
        });
      }

      if (period === "daily") {
        cursor.setUTCDate(cursor.getUTCDate() + 1);
      } else if (period === "weekly") {
        cursor.setUTCDate(cursor.getUTCDate() + 7);
      } else {
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      }
    }

    const sales = Array.from(salesBuckets.values())
      .map(bucket => ({
        ...bucket,
        revenueInRupees: bucket.revenueInPaise / 100
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return res.json({
      success: true,
      data: {
        filters: {
          period,
          from: from.toISOString(),
          to: to.toISOString(),
          eventId: eventId ?? null
        },
        summary: {
          ...summary,
          totalRevenueInRupees:
            summary.totalRevenueInPaise / 100,
          pendingRevenueInRupees:
            summary.pendingRevenueInPaise / 100
        },
        sales,
        events
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get the logged-in customer's bookings.
router.get("/mine", async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: includeDetails,
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      data: bookings.map(shapeBooking)
    });
  } catch (error) {
    next(error);
  }
});

// Create a booking and reserve its tickets.
router.post("/", async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Select 1–8 unique seats before continuing."
        }
      });
    }

    const { eventId, seats } = parsed.data;

    const booking = await prisma.$transaction(async tx => {
      const event = await tx.event.findUnique({
        where: { id: eventId }
      });

      if (!event || !event.isPublished || event.startsAt < new Date()) {
        const e = new Error(
          "Event not found or is not available for booking."
        );
        e.statusCode = 404;
        e.code = "EVENT_NOT_AVAILABLE";
        throw e;
      }

      if (event.availableTickets < seats.length) {
        const e = new Error(
          "Not enough tickets are available for this event."
        );
        e.statusCode = 409;
        e.code = "SOLD_OUT";
        throw e;
      }

      const held = await tx.bookingSeat.findMany({
        where: {
          eventId,
          seatCode: { in: seats },
          booking: {
            status: { in: ["PENDING", "CONFIRMED"] }
          }
        },
        select: { seatCode: true }
      });

      if (held.length) {
        const e = new Error(
          `These seats are no longer available: ${held.map(s => s.seatCode).join(", ")}`
        );
        e.statusCode = 409;
        e.code = "SEAT_UNAVAILABLE";
        throw e;
      }

      const decrement = await tx.event.updateMany({
        where: {
          id: eventId,
          availableTickets: { gte: seats.length }
        },
        data: {
          availableTickets: { decrement: seats.length }
        }
      });

      if (decrement.count !== 1) {
        const e = new Error(
          "Tickets just sold out. Please refresh and try again."
        );
        e.statusCode = 409;
        e.code = "SOLD_OUT";
        throw e;
      }

      const total = event.priceInPaise * seats.length;

      return tx.booking.create({
        data: {
          bookingReference:
            `VV-${randomBytes(6).toString("hex").toUpperCase()}`,
          userId: req.user.id,
          eventId,
          quantity: seats.length,
          unitPriceInPaise: event.priceInPaise,
          totalAmountInPaise: total,
          status: "PENDING",
          paymentStatus: "PENDING",
          seats: {
            create: seats.map(seatCode => ({
              seatCode,
              eventId
            }))
          }
        },
        include: includeDetails
      });
    }, {
      isolationLevel: "Serializable"
    });

    return res.status(201).json({
      success: true,
      data: shapeBooking(booking)
    });
  } catch (error) {
    if (error.code === "P2002" || error.code === "P2034") {
      return res.status(409).json({
        success: false,
        error: {
          code: "SEAT_CONFLICT",
          message:
            "One or more seats were just booked. Refresh the seat map and try again."
        }
      });
    }

    next(error);
  }
});

// Development-only mock payment.
// Production must use a verified payment-provider webhook.
router.post("/:id/mock-payment", async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Route not found."
        }
      });
    }

    const result = await prisma.booking.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
        status: "PENDING",
        paymentStatus: "PENDING"
      },
      data: {
        status: "CONFIRMED",
        paymentStatus: "SUCCEEDED"
      }
    });

    if (!result.count) {
      return res.status(409).json({
        success: false,
        error: {
          code: "BOOKING_NOT_PAYABLE",
          message:
            "This booking cannot be confirmed. Please check its status."
        }
      });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: includeDetails
    });

    return res.json({
      success: true,
      data: shapeBooking(booking),
      payment: {
        status: "SUCCEEDED",
        mode: "DEVELOPMENT_MOCK"
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;