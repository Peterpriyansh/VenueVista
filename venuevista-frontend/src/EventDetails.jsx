import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

import SeatSelection from "./SeatSelection";
import BookingSummary from "./BookingSummary";
import Payment from "./Payment";

export default function EventDetails({
  event,
  onBack,
  user,
}) {
  const [showSeatSelection, setShowSeatSelection] =
    useState(false);

  const [booking, setBooking] =
    useState(null);

  const [payment, setPayment] =
    useState(null);

  const [liked, setLiked] =
    useState(false);

  /*
  =====================================================
  PAYMENT SUCCESS
  =====================================================
  */

  if (booking && payment?.status === "SUCCESS") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0b0b",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            background: "#171717",
            border: "1px solid #c9a45c",
            borderRadius: "18px",
            padding: "40px 24px",
          }}
        >
          <div style={{ fontSize: "54px", color: "#c9a45c" }}>✓</div>
          <h1 style={{ color: "#c9a45c" }}>Booking Confirmed!</h1>
          <p>Your booking process is complete.</p>
          <p>
            <strong>Event:</strong> {booking.event?.title || "Your Event"}
          </p>
          <p>
            <strong>Payment ID:</strong> {payment.id || "Demo Payment"}
          </p>
          <button
            type="button"
            onClick={() => {
              setPayment(null);
              setBooking(null);
              setShowSeatSelection(false);
              onBack?.();
            }}
            style={{
              marginTop: "20px",
              padding: "13px 24px",
              border: "none",
              borderRadius: "8px",
              background: "#c9a45c",
              color: "#111111",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  /*
  =====================================================
  PAYMENT
  =====================================================
  */

  if (booking && payment) {
    return (
      <Payment
        booking={booking}
        onBack={() => setPayment(null)}
        onPaymentSuccess={(paymentData) => {
          console.log("PAYMENT SUCCESS:", paymentData);

          const successfulPayment = {
            ...(paymentData || {}),
            status: "SUCCESS",
          };

          // Save the confirmed ticket for the My Tickets page.
          const ticket = {
            ...booking,
            id:
              paymentData?.id ||
              paymentData?.paymentId ||
              `VV-${Date.now()}`,
            event: booking?.event || event,
            // Account ownership keeps tickets separated in this browser.
            ownerKey: String(user?.email || user?.id || user?.userId || "").trim().toLowerCase(),
            ownerEmail: String(user?.email || "").trim().toLowerCase(),
            ownerId: user?.id ?? user?.userId ?? null,
            payment: successfulPayment,
            paymentStatus: "SUCCESS",
            bookedAt: new Date().toISOString(),
          };

          try {
            const existingTickets = JSON.parse(
              localStorage.getItem("venuevista_booked_tickets") || "[]"
            );
            const tickets = Array.isArray(existingTickets)
              ? existingTickets
              : [];
            const alreadySaved = tickets.some(
              (savedTicket) => savedTicket.id === ticket.id
            );

            if (!alreadySaved) {
              localStorage.setItem(
                "venuevista_booked_tickets",
                JSON.stringify([...tickets, ticket])
              );
            }

            setPayment(successfulPayment);
          } catch (error) {
            console.error("Unable to save ticket:", error);
            alert(
              "Payment successful, but the ticket could not be saved in this browser. Please check browser storage."
            );
            setPayment(successfulPayment);
          }
        }}
      />
    );
  }

  /*
  =====================================================
  BOOKING SUMMARY
  =====================================================
  */

  if (booking) {
    return (
      <BookingSummary
        booking={booking}

        onBack={() => {
          setBooking(null);
        }}

        onProceedToPayment={(bookingData) => {
          console.log(
            "PROCEEDING TO PAYMENT:",
            bookingData
          );

          setBooking((previousBooking) => ({
            ...(previousBooking || {}),
            ...(bookingData || {}),
            event: bookingData?.event || previousBooking?.event || event,
          }));

          setPayment({
            status: "INITIATED",
          });
        }}
      />
    );
  }

  /*
  =====================================================
  SEAT SELECTION
  =====================================================
  */

  if (showSeatSelection) {
    return (
      <SeatSelection
        event={event}

        onBack={() => {
          setShowSeatSelection(false);
        }}

        onContinue={(bookingData) => {
          console.log(
            "BOOKING DATA:",
            bookingData
          );

          setBooking({
            ...(bookingData || {}),
            event: bookingData?.event || event,
          });
        }}
      />
    );
  }

  /*
  =====================================================
  EVENT NOT FOUND
  =====================================================
  */

  if (!event) {
    return (
      <div className="event-details-page">

        <button
          type="button"
          className="event-details-back"
          onClick={onBack}
        >
          <ArrowLeft size={16} />

          Back to Events
        </button>

        <div className="event-not-found">

          <h2>
            Event not found
          </h2>

          <button
            type="button"
            className="gold-button"
            onClick={onBack}
          >
            Browse Events
          </button>

        </div>

      </div>
    );
  }

  /*
  =====================================================
  EVENT DETAILS PAGE
  =====================================================
  */

  return (
    <div className="event-details-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="event-details-header">

        <div className="event-details-header-inner">

          <button
            type="button"
            className="event-details-back"
            onClick={onBack}
          >
            <ArrowLeft size={15} />

            Back to Events
          </button>

          <div className="event-details-logo">

            <span>
              V
            </span>

            <strong>
              VenueVista
            </strong>

          </div>

          <button
            type="button"
            className={`event-share-button ${
              liked ? "active" : ""
            }`}
            aria-label={
              liked
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            onClick={() =>
              setLiked(
                (value) => !value
              )
            }
          >
            <Heart
              size={17}
              fill={
                liked
                  ? "currentColor"
                  : "none"
              }
            />
          </button>

        </div>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="event-detail-hero">

        <img
          src={event.image}
          alt={event.title}
        />

        <div className="event-detail-hero-shade" />

        <div className="event-detail-hero-content">

          <div className="event-detail-category">
            {event.category}
          </div>

          <h1>
            {event.title}
          </h1>

          <div className="event-detail-hero-meta">

            <span>
              <CalendarDays size={14} />

              {event.date}
            </span>

            <span>
              <Clock3 size={14} />

              {event.time}
            </span>

            <span>
              <MapPin size={14} />

              {event.location},{" "}
              {event.city}
            </span>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="event-detail-main">

        <div className="event-detail-layout">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="event-detail-content">

            {/* ABOUT */}

            <section className="event-detail-section">

              <div className="event-detail-section-label">
                ABOUT THE EVENT
              </div>

              <h2>
                Experience it live
              </h2>

              <p>
                Get ready for an unforgettable
                experience at{" "}
                <strong>
                  {event.title}
                </strong>
                . Book your tickets through
                VenueVista and enjoy a seamless
                event experience from booking
                to entry.
              </p>

              <p>
                Choose your preferred ticket
                category and seating area.
                Your confirmed ticket will be
                available in My Tickets after
                successful payment.
              </p>

            </section>

            {/* =================================================
                EVENT INFO
            ================================================= */}

            <section className="event-info-grid">

              <div className="event-info-box">

                <span>
                  <CalendarDays size={17} />
                </span>

                <div>

                  <small>
                    DATE
                  </small>

                  <strong>
                    {event.date}
                  </strong>

                </div>

              </div>

              <div className="event-info-box">

                <span>
                  <Clock3 size={17} />
                </span>

                <div>

                  <small>
                    TIME
                  </small>

                  <strong>
                    {event.time}
                  </strong>

                </div>

              </div>

              <div className="event-info-box">

                <span>
                  <MapPin size={17} />
                </span>

                <div>

                  <small>
                    VENUE
                  </small>

                  <strong>
                    {event.location}
                  </strong>

                </div>

              </div>

              <div className="event-info-box">

                <span>
                  <Users size={17} />
                </span>

                <div>

                  <small>
                    CITY
                  </small>

                  <strong>
                    {event.city}
                  </strong>

                </div>

              </div>

            </section>

            {/* =================================================
                VENUE
            ================================================= */}

            <section className="event-detail-section">

              <div className="event-detail-section-label">
                VENUE
              </div>

              <h2>
                {event.location}
              </h2>

              <div className="venue-location-row">

                <MapPin size={15} />

                <span>
                  {event.location},{" "}
                  {event.city}
                </span>

              </div>

            </section>

            {/* =================================================
                TICKET INFORMATION
            ================================================= */}

            <section className="event-detail-section">

              <div className="event-detail-section-label">
                TICKET INFORMATION
              </div>

              <h2>
                Choose your experience
              </h2>

              <div className="event-ticket-types">

                <div className="event-ticket-type">

                  <div>

                    <strong>
                      Multiple Categories
                    </strong>

                    <span>
                      Choose from available
                      seating categories.
                    </span>

                  </div>

                  <Ticket size={18} />

                </div>

                <div className="event-ticket-type">

                  <div>

                    <strong>
                      Digital Ticket
                    </strong>

                    <span>
                      Your confirmed ticket
                      will be available online.
                    </span>

                  </div>

                  <ShieldCheck size={18} />

                </div>

              </div>

            </section>

            {/* =================================================
                IMPORTANT INFORMATION
            ================================================= */}

            <section className="event-detail-section">

              <div className="event-detail-section-label">
                IMPORTANT INFORMATION
              </div>

              <div className="event-rules">

                <div>

                  <span>
                    01
                  </span>

                  <p>
                    Entry is subject to valid
                    ticket verification at the
                    venue.
                  </p>

                </div>

                <div>

                  <span>
                    02
                  </span>

                  <p>
                    Please carry a valid
                    government-issued photo ID
                    along with your ticket.
                  </p>

                </div>

                <div>

                  <span>
                    03
                  </span>

                  <p>
                    Ticket availability and
                    pricing may vary by
                    category.
                  </p>

                </div>

                <div>

                  <span>
                    04
                  </span>

                  <p>
                    Tickets purchased through
                    VenueVista will appear under
                    My Tickets.
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT BOOKING CARD
          ================================================= */}

          <aside className="event-book-card">

            <div className="event-book-card-top">

              <span className="event-book-label">
                TICKETS
              </span>

              <div className="event-book-price">

                <small>
                  Starting from
                </small>

                <strong>
                  ₹
                  {Number(
                    event.price || 0
                  ).toLocaleString()}
                </strong>

              </div>

            </div>

            <div className="event-book-divider" />

            {/* SUMMARY */}

            <div className="event-book-summary">

              <div>

                <span>
                  Event
                </span>

                <strong>
                  {event.title}
                </strong>

              </div>

              <div>

                <span>
                  Date
                </span>

                <strong>
                  {event.date}
                </strong>

              </div>

              <div>

                <span>
                  Time
                </span>

                <strong>
                  {event.time}
                </strong>

              </div>

              <div>

                <span>
                  Venue
                </span>

                <strong>
                  {event.location}
                </strong>

              </div>

            </div>

            {/* =================================================
                SELECT TICKETS
            ================================================= */}

            <button
              type="button"
              className="event-select-button"
              onClick={() =>
                setShowSeatSelection(true)
              }
            >
              Select Tickets

              <ArrowRight size={15} />

            </button>

            {/* SECURITY */}

            <div className="event-secure-note">

              <ShieldCheck size={15} />

              <span>
                Secure booking • Instant
                confirmation
              </span>

            </div>

            {/* FEATURES */}

            <div className="event-book-features">

              <div>

                <Ticket size={14} />

                Digital ticket

              </div>

              <div>

                <ShieldCheck size={14} />

                Secure payment

              </div>

              <div>

                <Users size={14} />

                Multiple ticket
                categories

              </div>

            </div>

            {/* SMALL NOTE */}

            <div className="event-book-note">

              <span>
                FROM
              </span>

              <strong>
                ₹
                {Number(
                  event.price || 0
                ).toLocaleString()}
              </strong>

              <p>
                Final price depends on
                your selected seats and
                applicable booking fees.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}