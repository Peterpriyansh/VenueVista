import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Ticket,
  WalletCards,
} from "lucide-react";

export default function Payment({
  booking,
  onBack,
  onPaymentSuccess,
}) {
  const [method, setMethod] = useState("card");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const total = booking?.total || 0;

  const formattedCardNumber =
    useMemo(() => {
      const cleaned =
        cardNumber
          .replace(/\D/g, "")
          .slice(0, 16);

      return cleaned
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }, [cardNumber]);

  const handleCardNumber = (value) => {
    setCardNumber(
      value
        .replace(/\D/g, "")
        .slice(0, 16)
    );
  };

  const handleExpiry = (value) => {
    const cleaned = value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (cleaned.length >= 3) {
      setExpiry(
        `${cleaned.slice(
          0,
          2
        )}/${cleaned.slice(2)}`
      );
    } else {
      setExpiry(cleaned);
    }
  };

  const validatePayment = () => {
    setError("");

    if (method === "card") {
      if (
        cardNumber.replace(
          /\D/g,
          ""
        ).length !== 16
      ) {
        setError(
          "Please enter a valid 16-digit card number."
        );
        return false;
      }

      if (
        expiry.length !== 5
      ) {
        setError(
          "Please enter a valid expiry date."
        );
        return false;
      }

      if (
        cvv.length !== 3
      ) {
        setError(
          "Please enter a valid 3-digit CVV."
        );
        return false;
      }

      if (
        cardName.trim().length < 3
      ) {
        setError(
          "Please enter the name on your card."
        );
        return false;
      }
    }

    if (method === "upi") {
      if (
        !upiId.includes("@")
      ) {
        setError(
          "Please enter a valid UPI ID."
        );
        return false;
      }
    }

    return true;
  };

  const handlePayment = () => {
    if (!validatePayment()) {
      return;
    }

    setProcessing(true);

    /*
     * FRONTEND DEMO PAYMENT
     *
     * Production version:
     * Razorpay / Stripe / PayU / Cashfree
     * + Spring Boot payment verification
     */

    setTimeout(() => {
      const payment = {
        id: `VV-PAY-${Date.now()}`,

        status: "SUCCESS",

        method,

        amount: total,

        paidAt:
          new Date().toISOString(),

        booking,
      };

      setProcessing(false);

      onPaymentSuccess?.(
        payment
      );
    }, 1600);
  };

  if (!booking) {
    return (
      <div className="payment-empty">
        <Ticket size={30} />

        <h2>
          No booking found
        </h2>

        <button
          type="button"
          onClick={onBack}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">

      {/* HEADER */}

      <header className="payment-header">

        <div className="payment-header-inner">

          <button
            type="button"
            className="payment-back-button"
            onClick={onBack}
          >
            <ArrowLeft size={15} />

            Back
          </button>

          <div className="payment-brand">

            <span>V</span>

            <strong>
              VenueVista
            </strong>

          </div>

          <div className="payment-steps">

            <span className="completed">
              01
            </span>

            <i />

            <span className="completed">
              02
            </span>

            <i />

            <span className="active">
              03
            </span>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <main className="payment-main">

        <div className="payment-container">

          <div className="payment-heading">

            <span>
              SECURE CHECKOUT
            </span>

            <h1>
              Complete your payment
            </h1>

            <p>
              Your seats are reserved
              temporarily. Complete
              payment to confirm your
              booking.
            </p>

          </div>

          <div className="payment-layout">

            {/* LEFT */}

            <section className="payment-form-card">

              <div className="payment-card-heading">

                <div>

                  <span>
                    PAYMENT METHOD
                  </span>

                  <h2>
                    Choose how you'd
                    like to pay
                  </h2>

                </div>

                <LockKeyhole
                  size={18}
                />

              </div>

              {/* METHODS */}

              <div className="payment-methods">

                <button
                  type="button"
                  className={
                    method === "card"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMethod("card")
                  }
                >
                  <CreditCard
                    size={18}
                  />

                  <span>
                    Card
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    method === "upi"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMethod("upi")
                  }
                >
                  <Smartphone
                    size={18}
                  />

                  <span>
                    UPI
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    method === "wallet"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMethod("wallet")
                  }
                >
                  <WalletCards
                    size={18}
                  />

                  <span>
                    Wallet
                  </span>
                </button>

              </div>

              {/* CARD */}

              {method === "card" && (
                <div className="payment-fields">

                  <label>
                    <span>
                      CARD NUMBER
                    </span>

                    <div className="payment-input-icon">

                      <CreditCard
                        size={15}
                      />

                      <input
                        type="text"
                        value={
                          formattedCardNumber
                        }
                        onChange={(e) =>
                          handleCardNumber(
                            e.target.value
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                      />

                    </div>
                  </label>

                  <div className="payment-field-grid">

                    <label>
                      <span>
                        EXPIRY DATE
                      </span>

                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) =>
                          handleExpiry(
                            e.target.value
                          )
                        }
                        placeholder="MM/YY"
                        inputMode="numeric"
                      />
                    </label>

                    <label>
                      <span>
                        CVV
                      </span>

                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(
                            e.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                3
                              )
                          )
                        }
                        placeholder="•••"
                        inputMode="numeric"
                      />
                    </label>

                  </div>

                  <label>
                    <span>
                      NAME ON CARD
                    </span>

                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) =>
                        setCardName(
                          e.target.value
                        )
                      }
                      placeholder="Enter cardholder name"
                    />
                  </label>

                </div>
              )}

              {/* UPI */}

              {method === "upi" && (
                <div className="payment-fields">

                  <label>
                    <span>
                      UPI ID
                    </span>

                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) =>
                        setUpiId(
                          e.target.value
                        )
                      }
                      placeholder="yourname@upi"
                    />
                  </label>

                  <div className="upi-info">

                    <Smartphone
                      size={18}
                    />

                    <div>
                      <strong>
                        UPI payment
                      </strong>

                      <span>
                        You'll be redirected
                        to your UPI app to
                        authorize the payment.
                      </span>
                    </div>

                  </div>

                </div>
              )}

              {/* WALLET */}

              {method === "wallet" && (
                <div className="wallet-options">

                  <button
                    type="button"
                    onClick={() =>
                      setMethod(
                        "wallet"
                      )
                    }
                  >
                    <WalletCards
                      size={20}
                    />

                    <div>
                      <strong>
                        VenueVista Wallet
                      </strong>

                      <span>
                        Fast and secure
                        checkout
                      </span>
                    </div>
                  </button>

                  <p>
                    Wallet payment will
                    use your saved payment
                    method in the production
                    version.
                  </p>

                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="payment-error">
                  {error}
                </div>
              )}

              {/* PAY */}

              <button
                type="button"
                className="payment-pay-button"
                disabled={processing}
                onClick={
                  handlePayment
                }
              >

                {processing ? (
                  <>
                    <span className="payment-spinner" />

                    Processing payment...
                  </>
                ) : (
                  <>
                    Pay ₹
                    {total.toLocaleString()}

                    <ArrowRight
                      size={16}
                    />
                  </>
                )}

              </button>

              <div className="payment-secure-note">

                <ShieldCheck
                  size={15}
                />

                <span>
                  Payments are encrypted
                  and securely processed.
                </span>

              </div>

            </section>

            {/* RIGHT */}

            <aside className="payment-summary-card">

              <div className="payment-summary-label">
                ORDER SUMMARY
              </div>

              <div className="payment-event-preview">

                <img
                  src={
                    booking.event?.image
                  }
                  alt={
                    booking.event?.title
                  }
                />

                <div>

                  <span>
                    {booking.event?.category}
                  </span>

                  <h2>
                    {booking.event?.title}
                  </h2>

                  <p>
                    {booking.event?.date}
                  </p>

                  <p>
                    {booking.event?.venue},{" "}
                    {booking.event?.city}
                  </p>

                </div>

              </div>

              <div className="payment-divider" />

              <div className="payment-seat-heading">

                <span>
                  SELECTED SEATS
                </span>

                <strong>
                  {booking.selectedSeats
                    ?.length || 0}
                </strong>

              </div>

              <div className="payment-seat-list">

                {booking.selectedSeats?.map(
                  (seat) => (
                    <div
                      key={seat.id}
                      className="payment-seat-row"
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

                    </div>
                  )
                )}

              </div>

              <div className="payment-divider" />

              <div className="payment-price-row">

                <span>
                  Tickets
                </span>

                <strong>
                  ₹
                  {booking.subtotal?.toLocaleString()}
                </strong>

              </div>

              <div className="payment-price-row">

                <span>
                  Booking fee
                </span>

                <strong>
                  ₹
                  {booking.bookingFee?.toLocaleString()}
                </strong>

              </div>

              <div className="payment-total-row">

                <span>
                  Total payable
                </span>

                <strong>
                  ₹
                  {total.toLocaleString()}
                </strong>

              </div>

              <div className="payment-guarantee">

                <CheckCircle2
                  size={16}
                />

                <div>

                  <strong>
                    Booking protection
                  </strong>

                  <span>
                    Your selected seats are
                    reserved during checkout.
                  </span>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
}