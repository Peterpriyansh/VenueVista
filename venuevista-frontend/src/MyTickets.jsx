import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, Ticket, Download, Printer, QrCode, Search, Filter, CheckCircle2, Clock3 } from "lucide-react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

const STORAGE_KEY = "venuevista_booked_tickets";

function getTicketCode(ticket, index) {
  // Keep an existing booking ID where possible; fallback is stable for this saved ticket.
  return String(ticket.id || ticket.bookingId || `VV-${Date.now()}-${index}`);
}

function getSeatText(ticket) {
  const seats = ticket.selectedSeats || ticket.seats || ticket.seatNumbers;
  if (Array.isArray(seats)) {
    return seats.map((seat) => {
      if (seat == null) return "";
      if (typeof seat !== "object") return String(seat);
      return seat.label || seat.name || seat.seatNumber || seat.number || seat.code || seat.id || "";
    }).filter(Boolean).join(", ") || "Not specified";
  }
  if (seats && typeof seats === "object") {
    return seats.label || seats.name || seats.seatNumber || seats.number || seats.code || "Not specified";
  }
  return seats || "Not specified";
}

function getAmount(ticket) {
  return ticket.totalAmount ?? ticket.totalPrice ?? ticket.total ?? ticket.amount;
}

function getPaymentStatus(ticket) {
  const status = ticket.paymentStatus || ticket.payment?.status || "SUCCESS";
  return String(status).toUpperCase();
}

export default function MyTickets({ onBack, onBrowseEvents, user }) {
  const accountKey = String(user?.email || user?.id || user?.userId || "").trim().toLowerCase();
  const [tickets, setTickets] = useState([]);
  const [legacyTickets, setLegacyTickets] = useState([]);
  const [qrImages, setQrImages] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const list = Array.isArray(saved) ? saved : [];
      const owned = list.filter((ticket) => {
        const owner = String(ticket.ownerKey || ticket.ownerEmail || ticket.ownerId || "").trim().toLowerCase();
        return accountKey && owner === accountKey;
      });
      const unassigned = list.filter((ticket) =>
        !ticket.ownerKey && !ticket.ownerEmail && ticket.ownerId == null
      );
      setTickets(owned.slice().reverse());
      setLegacyTickets(unassigned.slice().reverse());
    } catch (error) {
      console.error("Unable to load tickets:", error);
      setTickets([]);
      setErrorMessage("Tickets load nahi ho paaye. Please refresh and try again.");
    }
  }, [accountKey]);

  const assignLegacyTicket = (ticketId) => {
    if (!accountKey) {
      setErrorMessage("Is ticket ko assign karne ke liye pehle login karein.");
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const list = Array.isArray(saved) ? saved : [];
      const updated = list.map((ticket) => {
        if (ticket.id !== ticketId || ticket.ownerKey || ticket.ownerEmail || ticket.ownerId != null) return ticket;
        return {
          ...ticket,
          ownerKey: accountKey,
          ownerEmail: String(user?.email || "").trim().toLowerCase(),
          ownerId: user?.id ?? user?.userId ?? null,
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setTickets(updated.filter((ticket) => {
        const owner = String(ticket.ownerKey || ticket.ownerEmail || ticket.ownerId || "").trim().toLowerCase();
        return owner === accountKey;
      }).reverse());
      setLegacyTickets(updated.filter((ticket) =>
        !ticket.ownerKey && !ticket.ownerEmail && ticket.ownerId == null
      ).reverse());
    } catch (error) {
      console.error("Unable to assign legacy ticket:", error);
      setErrorMessage("Ticket account se link nahi ho paaya. Please try again.");
    }
  };

  const ticketRows = useMemo(
    () => tickets.map((ticket, index) => {
      const event = ticket.event || {};
      const code = getTicketCode(ticket, index);
      const amount = getAmount(ticket);
      return {
        ticket,
        event,
        code,
        title: event.title || ticket.eventTitle || "Event Ticket",
        date: event.date || ticket.date || "Date not available",
        time: event.time || ticket.time || "Time not available",
        venue: event.location || event.venue || ticket.venue || "Venue not available",
        city: event.city || ticket.city || "",
        seats: getSeatText(ticket),
        amount,
        status: getPaymentStatus(ticket),
        bookedAt: ticket.bookedAt ? new Date(ticket.bookedAt).toLocaleString() : "Not available",
      };
    }),
    [tickets]
  );

  const normalizedStatus = (status) => {
    const value = String(status || "").toUpperCase();
    if (["SUCCESS", "PAID", "CONFIRMED", "SUCCEEDED"].includes(value)) return "CONFIRMED";
    if (["PENDING", "PROCESSING", "INITIATED"].includes(value)) return "PENDING";
    if (["CANCELLED", "CANCELED", "REFUNDED", "FAILED", "DECLINED"].includes(value)) return value === "REFUNDED" ? "REFUNDED" : value === "FAILED" || value === "DECLINED" ? "FAILED" : "CANCELLED";
    return value || "UNKNOWN";
  };

  const filteredTicketRows = useMemo(() => {
    const query = ticketSearch.trim().toLowerCase();
    return ticketRows.filter((row) => {
      const matchesStatus = statusFilter === "ALL" || normalizedStatus(row.status) === statusFilter;
      const searchable = [row.title, row.code, row.date, row.venue, row.city, row.status].join(" ").toLowerCase();
      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [ticketRows, ticketSearch, statusFilter]);

  const confirmedCount = ticketRows.filter((row) => normalizedStatus(row.status) === "CONFIRMED").length;
  const pendingCount = ticketRows.filter((row) => normalizedStatus(row.status) === "PENDING").length;
  const totalSpent = ticketRows.reduce((sum, row) => {
    return normalizedStatus(row.status) === "CONFIRMED" ? sum + (Number(row.amount) || 0) : sum;
  }, 0);

  useEffect(() => {
    let cancelled = false;
    async function buildQrs() {
      const entries = await Promise.all(ticketRows.map(async (row) => {
        try {
          // QR contains booking reference and basic event metadata only. It is not a secure entry pass
          // until a backend validates the booking and prevents duplicate scans.
          const payload = JSON.stringify({
            platform: "VenueVista",
            ticketId: row.code,
            event: row.title,
            date: row.date,
            status: row.status,
          });
          const dataUrl = await QRCode.toDataURL(payload, {
            errorCorrectionLevel: "M",
            margin: 1,
            width: 220,
            color: { dark: "#111111", light: "#ffffff" },
          });
          return [row.code, dataUrl];
        } catch (error) {
          console.error("Unable to create ticket QR:", error);
          return [row.code, null];
        }
      }));
      if (!cancelled) setQrImages(Object.fromEntries(entries));
    }
    buildQrs();
    return () => { cancelled = true; };
  }, [ticketRows]);

  const downloadPdf = async (row) => {
    setErrorMessage("");
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const gold = [201, 164, 92];
      doc.setFillColor(11, 11, 11);
      doc.rect(0, 0, 210, 297, "F");
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.8);
      doc.roundedRect(14, 14, 182, 269, 4, 4, "S");

      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(23);
      doc.text("VenueVista", 24, 32);
      doc.setFontSize(11);
      doc.setTextColor(230, 230, 230);
      doc.text("EVENT TICKET", 24, 42);
      doc.setDrawColor(90, 78, 51);
      doc.line(24, 49, 186, 49);

      doc.setTextColor(...gold);
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(row.title, 150);
      doc.text(titleLines, 24, 63);
      let y = 63 + titleLines.length * 8 + 8;

      const details = [
        ["DATE", row.date],
        ["TIME", row.time],
        ["VENUE", `${row.venue}${row.city ? `, ${row.city}` : ""}`],
        ["SEATS", row.seats],
        ["BOOKING ID", row.code],
        ["PAYMENT STATUS", row.status],
        ["BOOKED AT", row.bookedAt],
      ];
      details.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...gold);
        doc.text(label, 24, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(245, 245, 245);
        const lines = doc.splitTextToSize(String(value ?? "Not available"), 112);
        doc.text(lines, 62, y);
        y += Math.max(9, lines.length * 5 + 2);
      });

      if (row.amount != null) {
        doc.setDrawColor(90, 78, 51);
        doc.line(24, y + 1, 186, y + 1);
        y += 11;
        doc.setTextColor(...gold);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(`Total paid: INR ${Number(row.amount).toLocaleString("en-IN")}`, 24, y);
        y += 8;
      }

      const qr = qrImages[row.code];
      if (qr) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(142, 220, 38, 38, 2, 2, "F");
        doc.addImage(qr, "PNG", 145, 223, 32, 32);
        doc.setFontSize(8);
        doc.setTextColor(210, 210, 210);
        doc.text("Scan ticket reference", 161, 263, { align: "center" });
      }

      doc.setFontSize(8);
      doc.setTextColor(175, 175, 175);
      doc.text("Keep this ticket for your records. Entry validation requires the event organizer's verified system.", 24, 273, { maxWidth: 110 });
      doc.save(`VenueVista-${row.code.replace(/[^a-z0-9-_]/gi, "-")}.pdf`);
    } catch (error) {
      console.error("Unable to create ticket PDF:", error);
      setErrorMessage("PDF create nahi ho paayi. Check that qrcode and jspdf packages are installed.");
    }
  };

  const printTicket = (row) => {
    const qr = qrImages[row.code];
    const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      setErrorMessage("Print window blocked hai. Please allow pop-ups and try again.");
      return;
    }
    printWindow.document.write(`<!doctype html><html><head><title>VenueVista Ticket</title><style>body{font:16px Arial,sans-serif;padding:32px;color:#171717}.ticket{max-width:680px;margin:auto;border:2px solid #c9a45c;border-radius:16px;padding:28px}.brand{color:#98742e;font-size:24px;font-weight:bold}.muted{color:#666}.qr{width:160px;height:160px;object-fit:contain}h1{margin-bottom:8px}button{padding:10px 16px}@media print{button{display:none}.ticket{break-inside:avoid}}</style></head><body><article class="ticket"><div class="brand">VenueVista</div><p class="muted">EVENT TICKET</p><h1>${safe(row.title)}</h1><p><b>Date:</b> ${safe(row.date)}</p><p><b>Time:</b> ${safe(row.time)}</p><p><b>Venue:</b> ${safe(row.venue)}${row.city ? `, ${safe(row.city)}` : ""}</p><p><b>Seats:</b> ${safe(row.seats)}</p><p><b>Booking ID:</b> ${safe(row.code)}</p><p><b>Payment status:</b> ${safe(row.status)}</p>${row.amount != null ? `<p><b>Amount:</b> ₹${Number(row.amount).toLocaleString("en-IN")}</p>` : ""}${qr ? `<img class="qr" src="${qr}" alt="Ticket QR code"/>` : ""}<p class="muted">Entry validation requires the event organizer's verified system.</p><button onclick="window.print()">Print ticket</button></article><script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "32px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button type="button" onClick={onBack} style={{ background: "transparent", color: "#c9a45c", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <ArrowLeft size={17} /> Back
        </button>

        <h1 style={{ color: "#c9a45c", marginTop: 24 }}>My Tickets</h1>
        <p style={{ color: "#aaa" }}>Your successfully booked event tickets.</p>
        {errorMessage && <p role="alert" style={{ background: "#321818", color: "#ffb9b9", border: "1px solid #713838", borderRadius: 8, padding: 12 }}>{errorMessage}</p>}

        {tickets.length > 0 && (
          <>
            <section aria-label="Ticket summary" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 22 }}>
              <div style={summaryCardStyle}><span style={summaryLabelStyle}>Total bookings</span><strong style={summaryValueStyle}>{ticketRows.length}</strong></div>
              <div style={summaryCardStyle}><span style={summaryLabelStyle}><CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 5 }} />Confirmed</span><strong style={{ ...summaryValueStyle, color: "#7ed99a" }}>{confirmedCount}</strong></div>
              <div style={summaryCardStyle}><span style={summaryLabelStyle}><Clock3 size={14} style={{ verticalAlign: "middle", marginRight: 5 }} />Pending</span><strong style={{ ...summaryValueStyle, color: "#f0c674" }}>{pendingCount}</strong></div>
              <div style={summaryCardStyle}><span style={summaryLabelStyle}>Confirmed spend</span><strong style={summaryValueStyle}>₹{totalSpent.toLocaleString("en-IN")}</strong></div>
            </section>
            <section aria-label="Search and filter tickets" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(170px, 220px)", gap: 10, marginTop: 18 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 9, background: "#171717", border: "1px solid #444", borderRadius: 10, padding: "0 12px" }}>
                <Search size={17} color="#c9a45c" />
                <input aria-label="Search tickets" value={ticketSearch} onChange={(event) => setTicketSearch(event.target.value)} placeholder="Search event, venue or booking ID..." style={{ width: "100%", minWidth: 0, background: "transparent", border: 0, outline: 0, color: "#fff", padding: "13px 0" }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, background: "#171717", border: "1px solid #444", borderRadius: 10, padding: "0 12px" }}>
                <Filter size={16} color="#c9a45c" />
                <select aria-label="Filter tickets by payment status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ flex: 1, minWidth: 0, background: "#171717", color: "#fff", border: 0, outline: 0, padding: "13px 0" }}>
                  <option value="ALL">All statuses</option><option value="CONFIRMED">Confirmed</option><option value="PENDING">Pending</option><option value="CANCELLED">Cancelled</option><option value="FAILED">Failed</option><option value="REFUNDED">Refunded</option><option value="UNKNOWN">Other</option>
                </select>
              </label>
            </section>
          </>
        )}

        {legacyTickets.length > 0 && (
          <section style={{ marginTop: 24, padding: 20, background: "#171717", border: "1px solid #555", borderRadius: 14 }}>
            <h2 style={{ color: "#c9a45c", marginTop: 0 }}>Older tickets need account linking</h2>
            <p style={{ color: "#aaa" }}>
              Ye purane tickets abhi kisi account se linked nahi hain. Sahi account mein login karke us ticket ke saamne Assign button dabayein. Tickets delete nahi honge.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {legacyTickets.map((ticket, index) => (
                <div key={ticket.id || ticket.bookingId || index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: "1px solid #333", paddingTop: 10 }}>
                  <span>{ticket.event?.title || ticket.eventTitle || "Older event ticket"} · {ticket.id || ticket.bookingId || "No booking ID"}</span>
                  <button type="button" onClick={() => assignLegacyTicket(ticket.id)} style={actionStyle}>Assign to this account</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tickets.length === 0 ? (
          <section style={{ marginTop: 32, padding: 32, background: "#171717", border: "1px solid #333", borderRadius: 14, textAlign: "center" }}>
            <Ticket size={42} color="#c9a45c" />
            <h2>No tickets yet</h2>
            <p style={{ color: "#aaa" }}>Your confirmed bookings will appear here after payment.</p>
            <button type="button" onClick={onBrowseEvents} style={{ background: "#c9a45c", color: "#111", border: 0, borderRadius: 8, padding: "12px 20px", fontWeight: "bold", cursor: "pointer" }}>Browse Events</button>
          </section>
        ) : filteredTicketRows.length === 0 ? (
          <section style={{ marginTop: 24, padding: 26, background: "#171717", border: "1px solid #333", borderRadius: 14, textAlign: "center" }}>
            <Search size={30} color="#c9a45c" />
            <h2 style={{ marginBottom: 8 }}>No matching tickets</h2>
            <p style={{ color: "#aaa" }}>Search text ya payment status filter change karke dekhein.</p>
            <button type="button" onClick={() => { setTicketSearch(""); setStatusFilter("ALL"); }} style={secondaryActionStyle}>Clear filters</button>
          </section>
        ) : (
          <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
            {filteredTicketRows.map((row) => (
              <article key={row.code} style={{ background: "#171717", border: "1px solid #c9a45c", borderRadius: 14, padding: 24, display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 22 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, color: "#c9a45c", overflowWrap: "anywhere" }}>{row.title}</h2>
                    <span style={{ color: row.status === "SUCCESS" || row.status === "PAID" ? "#7ed99a" : "#f0c674" }}>✓ {row.status}</span>
                  </div>
                  <p><CalendarDays size={15} style={{ verticalAlign: "middle", marginRight: 8 }} />{row.date}</p>
                  <p><MapPin size={15} style={{ verticalAlign: "middle", marginRight: 8 }} />{row.venue}{row.city ? `, ${row.city}` : ""}</p>
                  <p>Time: {row.time}</p>
                  <p>Seats: {row.seats}</p>
                  {row.amount != null && <p>Amount: ₹{Number(row.amount).toLocaleString("en-IN")}</p>}
                  <p style={{ color: "#aaa", fontSize: 13, overflowWrap: "anywhere" }}>Booking ID: {row.code}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                    <button type="button" onClick={() => downloadPdf(row)} style={actionStyle}><Download size={16} /> Download PDF</button>
                    <button type="button" onClick={() => printTicket(row)} style={secondaryActionStyle}><Printer size={16} /> Print ticket</button>
                  </div>
                </div>
                <div style={{ alignSelf: "start", background: "#fff", borderRadius: 10, padding: 10, textAlign: "center", width: 150, maxWidth: "100%" }}>
                  {qrImages[row.code] ? <img src={qrImages[row.code]} alt={`QR code for ${row.title}`} style={{ width: "100%", height: "auto", display: "block" }} /> : <QrCode color="#111" size={90} />}
                  <small style={{ display: "block", color: "#111", overflowWrap: "anywhere", marginTop: 6 }}>ID: {row.code}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width: 620px) { main article { grid-template-columns: minmax(0, 1fr) !important; } main article > div:last-child { width: 132px !important; } }`}</style>
    </main>
  );
}

const summaryCardStyle = {
  background: "linear-gradient(145deg, #191919, #111111)",
  border: "1px solid #393328",
  borderRadius: 12,
  padding: "15px 16px",
  display: "grid",
  gap: 8,
};

const summaryLabelStyle = { color: "#aaa", fontSize: 12, display: "block" };
const summaryValueStyle = { color: "#c9a45c", fontSize: 23, lineHeight: 1.2 };

const actionStyle = {
  background: "#c9a45c", color: "#111", border: 0, borderRadius: 8,
  padding: "11px 14px", fontWeight: 700, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 8,
};

const secondaryActionStyle = {
  background: "transparent", color: "#c9a45c", border: "1px solid #c9a45c",
  borderRadius: 8, padding: "10px 14px", fontWeight: 700, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 8,
};
