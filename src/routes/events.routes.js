const express = require("express");
const { z } = require("zod");
const prisma = require("../config/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const querySchema = z.object({
  city: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

// Base schema remains unrefined so Zod v4 supports .partial().
const eventFieldsSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(1).max(10000),
  category: z.string().trim().min(1).max(80),
  venue: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().optional().nullable(),
  imageUrl: z.string().url().max(2000).optional().nullable(),
  priceInPaise: z.number().int().min(0).max(100000000),
  totalTickets: z.number().int().min(1).max(1000000),
  isPublished: z.boolean().optional()
});

const eventSchema = eventFieldsSchema.refine(
  v => !v.endsAt || v.endsAt > v.startsAt,
  {
    message: "Event end time must be after its start time.",
    path: ["endsAt"]
  }
);

const updateEventSchema = eventFieldsSchema.partial().refine(
  v => Object.keys(v).length > 0,
  { message: "Provide at least one field to update." }
);

function canManageEvent(user, event) {
  return user.role === "ADMIN" || event.organizerId === user.id;
}

function eventResponse(event) {
  return {
    ...event,
    priceInRupees: event.priceInPaise / 100
  };
}

// Organizer sees their own events; admin sees all events.
router.get("/manage", requireAuth, async (req, res, next) => {
  try {
    if (!["ORGANIZER", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Organizer or admin access is required."
        }
      });
    }

    const events = await prisma.event.findMany({
      where: req.user.role === "ADMIN"
        ? {}
        : { organizerId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      success: true,
      data: events.map(eventResponse)
    });
  } catch (error) {
    next(error);
  }
});

// Create event.
router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!["ORGANIZER", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Only organizers and admins can create events."
        }
      });
    }

    const parsed = eventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid event details.",
          details: parsed.error.issues
        }
      });
    }

    const data = parsed.data;

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        venue: data.venue,
        city: data.city,
        startsAt: data.startsAt,
        endsAt: data.endsAt ?? null,
        imageUrl: data.imageUrl ?? null,
        priceInPaise: data.priceInPaise,
        totalTickets: data.totalTickets,
        availableTickets: data.totalTickets,
        isPublished: data.isPublished ?? false,
        organizerId:
          req.user.role === "ORGANIZER" ? req.user.id : null
      }
    });

    return res.status(201).json({
      success: true,
      data: eventResponse(event)
    });
  } catch (error) {
    next(error);
  }
});

// Update event. Only its organizer or an admin can manage it.
router.patch("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!["ORGANIZER", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Organizer or admin access is required."
        }
      });
    }

    const parsed = updateEventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid event update.",
          details: parsed.error.issues
        }
      });
    }

    const existing = await prisma.event.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: "EVENT_NOT_FOUND",
          message: "Event not found."
        }
      });
    }

    if (!canManageEvent(req.user, existing)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You can only manage your own events."
        }
      });
    }

    const data = parsed.data;

    const usedTickets =
      existing.totalTickets - existing.availableTickets;

    if (
      data.totalTickets !== undefined &&
      data.totalTickets < usedTickets
    ) {
      return res.status(409).json({
        success: false,
        error: {
          code: "TICKET_CAPACITY_TOO_LOW",
          message:
            "Total tickets cannot be less than tickets already sold or reserved."
        }
      });
    }

    const startsAt = data.startsAt ?? existing.startsAt;
    const endsAt =
      data.endsAt === undefined ? existing.endsAt : data.endsAt;

    if (endsAt && endsAt <= startsAt) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_EVENT_DATES",
          message: "Event end time must be after its start time."
        }
      });
    }

    const updateData = { ...data };

    if (data.totalTickets !== undefined) {
      updateData.availableTickets = data.totalTickets - usedTickets;
    }

    const event = await prisma.event.update({
      where: { id: existing.id },
      data: updateData
    });

    return res.json({
      success: true,
      data: eventResponse(event)
    });
  } catch (error) {
    next(error);
  }
});
// Unpublish an event without deleting booking history.
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!["ORGANIZER", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Organizer or admin access is required."
        }
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: req.params.id }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          code: "EVENT_NOT_FOUND",
          message: "Event not found."
        }
      });
    }

    if (!canManageEvent(req.user, event)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You can only manage your own events."
        }
      });
    }

    const updated = await prisma.event.update({
      where: { id: event.id },
      data: { isPublished: false }
    });

    return res.json({
      success: true,
      message: "Event unpublished successfully.",
      data: eventResponse(updated)
    });
  } catch (error) {
    next(error);
  }
});

// Public list of upcoming published events.
router.get("/", async (req, res, next) => {
  try {
    const query = querySchema.safeParse(req.query);

    if (!query.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: query.error.issues
      });
    }

    const { city, category, search, page, limit } = query.data;

    const where = {
      isPublished: true,
      startsAt: { gte: new Date() },
      ...(city
        ? { city: { equals: city, mode: "insensitive" } }
        : {}),
      ...(category
        ? { category: { equals: category, mode: "insensitive" } }
        : {}),
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive"
                }
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive"
                }
              },
              {
                venue: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            ]
          }
        : {})
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startsAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          venue: true,
          city: true,
          startsAt: true,
          endsAt: true,
          imageUrl: true,
          priceInPaise: true,
          totalTickets: true,
          availableTickets: true
        }
      }),
      prisma.event.count({ where })
    ]);

    return res.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Public details for a published upcoming event.
router.get("/:id", async (req, res, next) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: req.params.id,
        isPublished: true,
        startsAt: { gte: new Date() }
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        venue: true,
        city: true,
        startsAt: true,
        endsAt: true,
        imageUrl: true,
        priceInPaise: true,
        totalTickets: true,
        availableTickets: true
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    return res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
});

module.exports = router;