import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
  X,
} from "lucide-react";

/*
=========================================================
SEAT PRICING
=========================================================
*/

const seatPrices = {
  VIP: 4999,
  Gold: 2999,
  Silver: 1499,
  Premium: 1999,
  General: 999,

  SportsPremium: 1999,
  SportsGeneral: 1499,
};

/*
=========================================================
SAMPLE SOLD SEATS
=========================================================
*/

const soldSeats = {
  Concerts: [
    "VIP-A-04",
    "VIP-A-05",
    "VIP-B-07",

    "GOLD-A-03",
    "GOLD-A-04",
    "GOLD-B-10",

    "SILVER-C-05",
    "SILVER-C-06",
    "SILVER-D-12",
  ],

  Sports: [
    "SPORTS-PREMIUM-WEST-A-04",
    "SPORTS-PREMIUM-WEST-A-05",
    "SPORTS-PREMIUM-WEST-B-08",

    "SPORTS-PREMIUM-EAST-A-03",
    "SPORTS-PREMIUM-EAST-A-04",

    "SPORTS-GENERAL-NORTH-C-10",

    "SPORTS-GENERAL-SOUTH-B-06",
    "SPORTS-GENERAL-SOUTH-B-07",
  ],

  Theatre: [
    "PREMIUM-A-04",
    "PREMIUM-A-05",
    "PREMIUM-B-08",
    "PREMIUM-C-03",

    "GENERAL-D-10",
    "GENERAL-E-07",
  ],

  Comedy: [
    "COMEDY-PREMIUM-A-04",
    "COMEDY-PREMIUM-B-06",
    "COMEDY-PREMIUM-B-07",

    "COMEDY-GENERAL-C-09",
    "COMEDY-GENERAL-D-04",
  ],
};

/*
=========================================================
HELPER
=========================================================
*/

function createSeats(
  prefix,
  rows,
  seatsPerRow
) {
  const seats = [];

  rows.forEach((row) => {
    for (
      let number = 1;
      number <= seatsPerRow;
      number++
    ) {
      seats.push({
        id: `${prefix}-${row}-${String(
          number
        ).padStart(2, "0")}`,

        row,

        number,
      });
    }
  });

  return seats;
}

/*
=========================================================
INDIVIDUAL SEAT
=========================================================
*/

function Seat({
  seat,
  category,
  selected,
  sold,
  onClick,
}) {
  return (
    <button
      type="button"
      className={[
        "seat",

        selected
          ? "selected"
          : "",

        sold
          ? "sold"
          : "",

        `seat-${category
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      ].join(" ")}
      disabled={sold}
      onClick={() =>
        onClick(seat)
      }
      title={
        sold
          ? "Already booked"
          : `${category} — Row ${seat.row}, Seat ${seat.number}`
      }
    >
      {selected ? (
        <Check size={10} />
      ) : (
        seat.number
      )}
    </button>
  );
}

/*
=========================================================
CONCERT MAP
=========================================================
*/

function ConcertMap({
  selectedSeats,
  toggleSeat,
}) {
  const sections = [
    {
      name: "VIP",

      price: seatPrices.VIP,

      rows: ["A", "B"],

      seats: 10,

      prefix: "VIP",
    },

    {
      name: "Gold",

      price: seatPrices.Gold,

      rows: ["A", "B", "C"],

      seats: 12,

      prefix: "GOLD",
    },

    {
      name: "Silver",

      price: seatPrices.Silver,

      rows: [
        "A",
        "B",
        "C",
        "D",
      ],

      seats: 14,

      prefix: "SILVER",
    },
  ];

  return (
    <div className="seat-map concert-map">

      <div className="seat-stage">
        <span>
          STAGE
        </span>
      </div>

      <div className="seat-map-caption">
        Facing the stage
      </div>

      {sections.map(
        (section) => {
          const seats =
            createSeats(
              section.prefix,
              section.rows,
              section.seats
            );

          return (
            <div
              className="seat-section"
              key={section.name}
            >

              <div className="seat-section-heading">

                <div>

                  <strong>
                    {section.name}
                  </strong>

                  <span>
                    ₹
                    {section.price.toLocaleString()}
                  </span>

                </div>

              </div>

              <div className="seat-rows">

                {section.rows.map(
                  (row) => {

                    const rowSeats =
                      seats.filter(
                        (seat) =>
                          seat.row === row
                      );

                    return (
                      <div
                        className="seat-row"
                        key={row}
                      >

                        <span className="row-label">
                          {row}
                        </span>

                        <div className="seat-row-items">

                          {rowSeats.map(
                            (seat) => (
                              <Seat
                                key={
                                  seat.id
                                }
                                seat={
                                  seat
                                }
                                category={
                                  section.name
                                }
                                selected={selectedSeats.includes(
                                  seat.id
                                )}
                                sold={soldSeats.Concerts.includes(
                                  seat.id
                                )}
                                onClick={
                                  toggleSeat
                                }
                              />
                            )
                          )}

                        </div>

                        <span className="row-label">
                          {row}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          );
        }
      )}

      <div className="standing-zone">
        GENERAL ADMISSION
      </div>

    </div>
  );
}

/*
=========================================================
SPORTS MAP
=========================================================
*/

function SportsMap({
  selectedSeats,
  toggleSeat,
}) {
  const blocks = [
    {
      name: "WEST",

      category: "SportsPremium",

      label: "Premium",

      price:
        seatPrices.SportsPremium,

      rows: ["A", "B"],

      seats: 10,
    },

    {
      name: "EAST",

      category: "SportsPremium",

      label: "Premium",

      price:
        seatPrices.SportsPremium,

      rows: ["A", "B"],

      seats: 10,
    },

    {
      name: "NORTH",

      category: "SportsGeneral",

      label: "General",

      price:
        seatPrices.SportsGeneral,

      rows: ["C", "D"],

      seats: 12,
    },

    {
      name: "SOUTH",

      category: "SportsGeneral",

      label: "General",

      price:
        seatPrices.SportsGeneral,

      rows: ["A", "B"],

      seats: 12,
    },
  ];

  return (
    <div className="seat-map sports-map">

      <div className="sports-field">

        <div className="sports-pitch">
          <span>
            FIELD
          </span>
        </div>

      </div>

      <div className="stadium-ring">

        {blocks.map(
          (block) => (
            <div
              className={`stadium-block stadium-${block.name.toLowerCase()}`}
              key={block.name}
            >

              <strong>
                {block.name}
              </strong>

              <small>
                {block.label} • ₹
                {block.price.toLocaleString()}
              </small>

              <div className="sports-seat-list">

                {block.rows.map(
                  (row) => {

                    const prefix =
                      `SPORTS-${block.category === "SportsPremium" ? "PREMIUM" : "GENERAL"}-${block.name}`;

                    const seats =
                      createSeats(
                        prefix,
                        [row],
                        block.seats
                      );

                    return (
                      <div
                        className="seat-row"
                        key={row}
                      >

                        <span className="row-label">
                          {row}
                        </span>

                        <div className="seat-row-items">

                          {seats.map(
                            (seat) => (
                              <Seat
                                key={
                                  seat.id
                                }
                                seat={
                                  seat
                                }
                                category={
                                  block.label
                                }
                                selected={selectedSeats.includes(
                                  seat.id
                                )}
                                sold={soldSeats.Sports.includes(
                                  seat.id
                                )}
                                onClick={
                                  toggleSeat
                                }
                              />
                            )
                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

/*
=========================================================
THEATRE MAP
=========================================================
*/

function TheatreMap({
  selectedSeats,
  toggleSeat,
}) {
  const rows = [
    {
      name: "PREMIUM",

      price: seatPrices.Premium,

      count: 10,
    },

    {
      name: "PREMIUM",

      price: seatPrices.Premium,

      count: 12,
    },

    {
      name: "GENERAL",

      price: seatPrices.General,

      count: 14,
    },

    {
      name: "GENERAL",

      price: seatPrices.General,

      count: 16,
    },

    {
      name: "GENERAL",

      price: seatPrices.General,

      count: 18,
    },
  ];

  return (
    <div className="seat-map theatre-map">

      <div className="theatre-stage">
        <span>
          STAGE
        </span>
      </div>

      <div className="theatre-rows">

        {rows.map(
          (row, index) => {

            const rowLetter =
              String.fromCharCode(
                65 + index
              );

            const seats =
              createSeats(
                row.name,
                [rowLetter],
                row.count
              );

            return (
              <div
                className={`theatre-row theatre-row-${index}`}
                key={rowLetter}
              >

                <span className="row-label">
                  {rowLetter}
                </span>

                <div className="theatre-seat-line">

                  {seats.map(
                    (seat) => (
                      <Seat
                        key={
                          seat.id
                        }
                        seat={
                          seat
                        }
                        category={
                          row.name
                        }
                        selected={selectedSeats.includes(
                          seat.id
                        )}
                        sold={soldSeats.Theatre.includes(
                          seat.id
                        )}
                        onClick={
                          toggleSeat
                        }
                      />
                    )
                  )}

                </div>

                <span className="row-label">
                  {rowLetter}
                </span>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

/*
=========================================================
COMEDY MAP
=========================================================
*/

function ComedyMap({
  selectedSeats,
  toggleSeat,
}) {
  const tables = [
    {
      id: "A",

      category: "Premium",

      price: seatPrices.Premium,

      seats: 4,
    },

    {
      id: "B",

      category: "Premium",

      price: seatPrices.Premium,

      seats: 4,
    },

    {
      id: "C",

      category: "General",

      price: seatPrices.General,

      seats: 4,
    },

    {
      id: "D",

      category: "General",

      price: seatPrices.General,

      seats: 4,
    },
  ];

  return (
    <div className="seat-map comedy-map">

      <div className="comedy-stage">
        <span>
          COMEDY STAGE
        </span>
      </div>

      <div className="comedy-tables">

        {tables.map(
          (table) => (
            <div
              className={`comedy-table ${
                table.category ===
                "Premium"
                  ? "premium-table"
                  : ""
              }`}
              key={table.id}
            >

              <div className="table-center">

                TABLE{" "}
                {table.id}

                <small>
                  ₹
                  {table.price.toLocaleString()}
                </small>

              </div>

              <div className="table-seats">

                {Array.from({
                  length:
                    table.seats,
                }).map(
                  (_, index) => {

                    const id =
                      `COMEDY-${table.category.toUpperCase()}-${table.id}-${String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}`;

                    const seat = {
                      id,

                      row: table.id,

                      number:
                        index + 1,
                    };

                    return (
                      <Seat
                        key={id}
                        seat={seat}
                        category={
                          table.category
                        }
                        selected={selectedSeats.includes(
                          id
                        )}
                        sold={soldSeats.Comedy.includes(
                          id
                        )}
                        onClick={
                          toggleSeat
                        }
                      />
                    );
                  }
                )}

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

/*
=========================================================
MAIN COMPONENT
=========================================================
*/

export default function SeatSelection({
  event,
  onBack,
  onContinue,
}) {
  const [
    selectedSeats,
    setSelectedSeats,
  ] = useState([]);

  const category =
    event?.category ||
    "Concerts";

  /*
  =======================================================
  TOGGLE SEAT
  =======================================================
  */

  const toggleSeat = (seat) => {
    setSelectedSeats(
      (current) => {

        if (
          current.includes(
            seat.id
          )
        ) {
          return current.filter(
            (id) =>
              id !== seat.id
          );
        }

        if (
          current.length >= 8
        ) {
          return current;
        }

        return [
          ...current,
          seat.id,
        ];
      }
    );
  };

  /*
  =======================================================
  SEAT DETAILS + PRICING
  =======================================================
  */

  const seatDetails =
    useMemo(() => {

      return selectedSeats.map(
        (id) => {

          /*
          -----------------------------------------------
          CONCERT VIP
          -----------------------------------------------
          */

          if (
            id.startsWith("VIP-")
          ) {
            return {
              id,
              type: "VIP",
              price:
                seatPrices.VIP,
            };
          }

          /*
          -----------------------------------------------
          CONCERT GOLD
          -----------------------------------------------
          */

          if (
            id.startsWith("GOLD-")
          ) {
            return {
              id,
              type: "Gold",
              price:
                seatPrices.Gold,
            };
          }

          /*
          -----------------------------------------------
          CONCERT SILVER
          -----------------------------------------------
          */

          if (
            id.startsWith("SILVER-")
          ) {
            return {
              id,
              type: "Silver",
              price:
                seatPrices.Silver,
            };
          }

          /*
          -----------------------------------------------
          SPORTS PREMIUM
          -----------------------------------------------
          */

          if (
            id.startsWith(
              "SPORTS-PREMIUM-"
            )
          ) {
            return {
              id,
              type: "Sports Premium",
              price:
                seatPrices.SportsPremium,
            };
          }

          /*
          -----------------------------------------------
          SPORTS GENERAL
          -----------------------------------------------
          */

          if (
            id.startsWith(
              "SPORTS-GENERAL-"
            )
          ) {
            return {
              id,
              type: "Sports General",
              price:
                seatPrices.SportsGeneral,
            };
          }

          /*
          -----------------------------------------------
          THEATRE / COMEDY PREMIUM
          -----------------------------------------------
          */

          if (
            id.includes(
              "PREMIUM"
            )
          ) {
            return {
              id,
              type: "Premium",
              price:
                seatPrices.Premium,
            };
          }

          /*
          -----------------------------------------------
          GENERAL
          -----------------------------------------------
          */

          return {
            id,
            type: "General",
            price:
              seatPrices.General,
          };
        }
      );

    }, [selectedSeats]);

  /*
  =======================================================
  PRICE CALCULATION
  =======================================================
  */

  const subtotal =
    seatDetails.reduce(
      (total, seat) =>
        total + seat.price,
      0
    );

  const bookingFee =
    selectedSeats.length > 0
      ? Math.round(
          subtotal * 0.05
        )
      : 0;

  const total =
    subtotal + bookingFee;

  /*
  =======================================================
  INVALID EVENT
  =======================================================
  */

  if (!event) {
    return null;
  }

  /*
  =======================================================
  RENDER
  =======================================================
  */

  return (
    <div className="seat-selection-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="seat-selection-header">

        <div className="seat-selection-header-inner">

          <button
            type="button"
            className="seat-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={15} />

            Back
          </button>

          <div className="seat-selection-brand">

            <span>
              V
            </span>

            <strong>
              VenueVista
            </strong>

          </div>

          <div className="seat-step-indicator">

            <span className="active">
              01
            </span>

            <i />

            <span>
              02
            </span>

            <i />

            <span>
              03
            </span>

          </div>

        </div>

      </header>

      {/* =================================================
          EVENT BAR
      ================================================= */}

      <section className="seat-event-bar">

        <div className="seat-event-info">

          <img
            src={event.image}
            alt={event.title}
          />

          <div>

            <span>
              {event.category}
            </span>

            <h1>
              {event.title}
            </h1>

            <p>

              <CalendarDays
                size={13}
              />

              {event.date}

              <MapPin
                size={13}
              />

              {event.venue},{" "}
              {event.city}

            </p>

          </div>

        </div>

        <div className="seat-event-ticket">

          <Ticket size={17} />

          <span>
            Select your seats
          </span>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="seat-selection-main">

        <div className="seat-selection-layout">

          {/* =================================================
              MAP
          ================================================= */}

          <section className="seat-map-panel">

            <div className="seat-panel-heading">

              <div>

                <span>
                  SELECT YOUR SEATS
                </span>

                <h2>
                  Choose your preferred
                  seating
                </h2>

              </div>

              <div className="seat-capacity">

                <Users size={14} />

                Max 8 seats

              </div>

            </div>

            {/* LEGEND */}

            <div className="seat-legend">

              <div>

                <span className="legend-seat available" />

                Available

              </div>

              <div>

                <span className="legend-seat selected" />

                Selected

              </div>

              <div>

                <span className="legend-seat sold" />

                Sold

              </div>

            </div>

            {/* MAP */}

            {category ===
            "Sports" ? (

              <SportsMap
                selectedSeats={
                  selectedSeats
                }
                toggleSeat={
                  toggleSeat
                }
              />

            ) : category ===
              "Theatre" ? (

              <TheatreMap
                selectedSeats={
                  selectedSeats
                }
                toggleSeat={
                  toggleSeat
                }
              />

            ) : category ===
              "Comedy" ? (

              <ComedyMap
                selectedSeats={
                  selectedSeats
                }
                toggleSeat={
                  toggleSeat
                }
              />

            ) : (

              <ConcertMap
                selectedSeats={
                  selectedSeats
                }
                toggleSeat={
                  toggleSeat
                }
              />

            )}

          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside className="seat-summary">

            <div className="seat-summary-heading">

              <span>
                BOOKING SUMMARY
              </span>

              <h2>
                Your selection
              </h2>

            </div>

            {/* EVENT */}

            <div className="seat-summary-event">

              <img
                src={event.image}
                alt=""
              />

              <div>

                <strong>
                  {event.title}
                </strong>

                <small>
                  {event.date}
                </small>

                <small>
                  {event.venue}
                </small>

              </div>

            </div>

            <div className="seat-summary-divider" />

            {/* SELECTED SEATS */}

            <div className="selected-seat-title">

              <span>
                SELECTED SEATS
              </span>

              <strong>
                {selectedSeats.length}/8
              </strong>

            </div>

            {seatDetails.length ===
            0 ? (

              <div className="no-seat-selected">

                <Ticket size={22} />

                <p>
                  Select seats from the
                  seating map to continue.
                </p>

              </div>

            ) : (

              <div className="selected-seat-list">

                {seatDetails.map(
                  (seat) => (

                    <div
                      className="selected-seat-item"
                      key={seat.id}
                    >

                      <div>

                        <strong>
                          {seat.id}
                        </strong>

                        <span>
                          {seat.type}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {seat.price.toLocaleString()}
                      </strong>

                      <button
                        type="button"
                        aria-label={`Remove ${seat.id}`}
                        onClick={() =>
                          toggleSeat({
                            id: seat.id,
                          })
                        }
                      >
                        <X size={12} />
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

            <div className="seat-summary-divider" />

            {/* PRICE */}

            <div className="seat-price-line">

              <span>
                Tickets
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString()}
              </strong>

            </div>

            <div className="seat-price-line">

              <span>
                Booking fee
              </span>

              <strong>
                ₹
                {bookingFee.toLocaleString()}
              </strong>

            </div>

            <div className="seat-total-line">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString()}
              </strong>

            </div>

            {/* CONTINUE */}

            <button
              type="button"
              className="seat-continue-button"
              disabled={
                selectedSeats.length === 0
              }
              onClick={() => {

                if (
                  selectedSeats.length ===
                  0
                ) {
                  return;
                }

                onContinue?.({
                  event,

                  selectedSeats:
                    seatDetails,

                  subtotal,

                  bookingFee,

                  total,
                });

              }}
            >

              Continue to Booking

              <ArrowRight size={15} />

            </button>

            {/* SECURITY */}

            <div className="seat-security">

              <ShieldCheck size={15} />

              <div>

                <strong>
                  Secure booking
                </strong>

                <span>
                  Your seats are temporarily
                  held while you complete
                  the booking.
                </span>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}