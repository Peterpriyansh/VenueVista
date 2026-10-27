import React from "react";
import { CalendarDays, Ticket, Home, LogIn, Music2, Compass } from "lucide-react";

export default function SiteNav({
  user,
  onHome,
  onEvents,
  onTickets,
  onLogin,
  onLogout,
  onSection,
}) {
  return (
    <header className="global-site-nav">
      <button type="button" className="global-nav-brand" onClick={onHome}>
        <span className="global-nav-mark">V</span>
        <span><strong>VenueVista</strong><small>Events. Venues. Experiences.</small></span>
      </button>
      <nav className="global-nav-links" aria-label="Main navigation">
        <button type="button" onClick={onHome}><Home size={15} /> Home</button>
        <button type="button" onClick={onEvents}><Compass size={15} /> Events</button>
        <button type="button" onClick={() => onSection("artists")}><Music2 size={15} /> Artists</button>
        <button type="button" onClick={() => onSection("categories")}><CalendarDays size={15} /> Categories</button>
      </nav>
      <div className="global-nav-actions">
        <button type="button" className="global-nav-ticket" onClick={onTickets}>
          <Ticket size={15} /> My Tickets
        </button>
        {user ? (
          <button type="button" className="global-nav-login" onClick={onLogout}>
            Log out · {user.firstName || user.fullName || "Account"}
          </button>
        ) : (
          <button type="button" className="global-nav-login" onClick={onLogin}>
            <LogIn size={15} /> Login
          </button>
        )}
      </div>
    </header>
  );
}
