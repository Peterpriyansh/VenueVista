import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

export default function BookingSummary({
  booking,
  onBack,
  onProceedToPayment,
}) {
  if (!booking || !booking.event) {
    return (
      <div className="booking-summary-page">
        <div className="booking-summary-empty">
          <Ticket size={38} />
          <h2>No booking found</h2>
          <p>Please select an event and seats first.</p>

          <button
            type="button"
            onClick={onBack}
            className="booking-primary-button"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const {
    event,
    selectedSeats = [],
    subtotal = 0,
    bookingFee = 0,
    total = 0,
  } = booking;

  return (
    <div className="booking-summary-page">

      {/* HEADER */}

      <header className="booking-summary-header">
        <div className="booking-summary-header-inner">

          <button
            type="button"
            className="booking-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back to Seat Selection
          </button>

          <div className="booking-step-indicator">

            <div className="booking-step completed">
              <span>1</span>
              Seats
            </div>

            <div className="booking-step-line active" />

            <div className="booking-step active">
              <span>2</span>
              Summary
            </div>

            <div className="booking-step-line" />

            <div className="booking-step">
              <span>3</span>
              Payment
            </div>

          </div>

        </div>
      </header>

      {/* MAIN */}

      <main className="booking-summary-content">

        <div className="booking-summary-heading">
          <span>YOUR BOOKING</span>

          <h1>Booking Summary</h1>

          <p>
            Review your event, seats and total amount
            before continuing to secure payment.
          </p>
        </div>

        <div className="booking-summary-layout">

          {/* LEFT */}

          <section className="booking-summary-main">

            {/* EVENT */}

            <div className="booking-event-card">

              <img
                src={event.image}
                alt={event.title}
              />

              <div className="booking-event-info">

                <span className="booking-event-category">
                  {event.category}
                </span>

                <h2>{event.title}</h2>

                <div className="booking-event-details">

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
                    {event.venue}
                  </span>

                </div>

              </div>

            </div>

            {/* SEATS */}

            <div className="booking-section-card">

              <div className="booking-section-title">

                <div>
                  <span>SELECTED TICKETS</span>
                  <h3>
                    {selectedSeats.length}{" "}
                    {selectedSeats.length === 1
                      ? "Seat"
                      : "Seats"}
                  </h3>
                </div>

                <Users size={19} />

              </div>

              {selectedSeats.length > 0 ? (
                <div className="booking-seat-list">

                  {selectedSeats.map((seat) => (
                    <div
                      className="booking-seat-row"
                      key={seat.id}
                    >
                      <div className="booking-seat-left">

                        <div className="booking-seat-icon">
                          <Ticket size={15} />
                        </div>

                        <div>
                          <strong>
                            {seat.id}
                          </strong>

                          <small>
                            {seat.category || "Standard"}
                          </small>
                        </div>

                      </div>

                      <strong>
                        ₹
                        {Number(
                          seat.price || 0
                        ).toLocaleString()}
                      </strong>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="booking-no-seats">
                  No seats selected.
                </div>
              )}

            </div>

            {/* SECURITY */}

            <div className="booking-security-card">

              <ShieldCheck size={21} />

              <div>
                <strong>
                  Secure Booking
                </strong>

                <p>
                  Your booking information is
                  protected and payment is processed
                  through a secure checkout.
                </p>
              </div>

            </div>

          </section>

          {/* RIGHT */}

          <aside className="booking-price-card">

            <span className="booking-price-eyebrow">
              PAYMENT SUMMARY
            </span>

            <h2>
              Price Details
            </h2>

            <div className="booking-price-divider" />

            <div className="booking-price-row">
              <span>
                Tickets
              </span>

              <strong>
                ₹
                {Number(
                  subtotal
                ).toLocaleString()}
              </strong>
            </div>

            <div className="booking-price-row">
              <span>
                Booking Fee
              </span>

              <strong>
                ₹
                {Number(
                  bookingFee
                ).toLocaleString()}
              </strong>
            </div>

            <div className="booking-price-divider" />

            <div className="booking-total-row">
              <div>
                <span>Total Amount</span>
                <small>Inclusive of applicable fees</small>
              </div>

              <strong>
                ₹
                {Number(
                  total
                ).toLocaleString()}
              </strong>
            </div>

            <button
              type="button"
              className="booking-primary-button"
              disabled={selectedSeats.length === 0}
              onClick={() =>
                onProceedToPayment(booking)
              }
            >
              Proceed to Payment
              <ArrowRight size={16} />
            </button>

            <p className="booking-payment-note">
              🔒 Secure payment • Instant confirmation
            </p>

          </aside>

        </div>

      </main>
    </div>
  );
}