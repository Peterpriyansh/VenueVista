import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import {
  Search,
  MapPin,
  CalendarDays,
  Heart,
  ArrowRight,
  Ticket,
  Trophy,
  Drama,
  Laugh,
  Tent,
  Sparkles,
  Building2,
  Star,
  Users,
  Menu,
  X,
  Music,
  Music2,
  Palette,
  Mic2,
  Play,
} from "lucide-react";

import "./styles.css";
import Events from "./Events";
import Login from "./Login";
import Register from "./Register";
import MyTickets from "./MyTickets";
import SiteNav from "./SiteNav";

/* =====================================================
   HERO IMAGE
===================================================== */

const ARIJIT_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Arijit_Singh.jpg";

const heroSlides = [
  {
    artist: "Arijit Singh",
    kicker: "LIVE IN CONCERT",
    tagline: "The Voice That Touches Millions",
    date: "18 Oct 2026",
    venue: "Jio World Garden, Mumbai",
    image: ARIJIT_IMAGE,
    category: "Concerts",
  },
  {
    artist: "Diljit Dosanjh",
    kicker: "LIVE TOUR",
    tagline: "A night of music, energy and unforgettable moments",
    date: "Explore upcoming dates",
    venue: "Check available cities and venues",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=90",
    category: "Concerts",
  },
  {
    artist: "A. R. Rahman",
    kicker: "MUSIC FOR EVERY GENERATION",
    tagline: "Experience the soundtracks that shaped a generation",
    date: "Explore upcoming dates",
    venue: "Check available cities and venues",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1800&q=90",
    category: "Concerts",
  },
  {
    artist: "Coldplay",
    kicker: "GLOBAL LIVE EXPERIENCES",
    tagline: "Lights, sound and a stadium full of memories",
    date: "Tour updates",
    venue: "Check the live event catalogue",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1800&q=90",
    category: "Concerts",
  },
];

const popularArtists = [
  "Arijit Singh",
  "Diljit Dosanjh",
  "Shreya Ghoshal",
  "A. R. Rahman",
  "Sonu Nigam",
  "Sunidhi Chauhan",
  "Neha Kakkar",
  "Vishal-Shekhar",
  "Pritam",
  "Jubin Nautiyal",
  "King",
  "Badshah",
  "Karan Aujla",
  "AP Dhillon",
  "Guru Randhawa",
  "Anuv Jain",
  "Prateek Kuhad",
  "Mohit Chauhan",
  "Shaan",
  "Kailash Kher",
  "B Praak",
  "Darshan Raval",
  "Armaan Malik",
  "Asees Kaur",
  "Shankar Mahadevan",
  "Hariharan",
  "Ritviz",
  "Nucleya",
  "DIVINE",
  "Raftaar",
  "Emiway Bantai",
  "Yo Yo Honey Singh",
  "Lata Mangeshkar",
  "Kishore Kumar",
  "Asha Bhosle",
  "Kumar Sanu",
  "Udit Narayan",
  "Alka Yagnik",
  "KK",
  "Mohammed Rafi",
  "Mika Singh",
  "Sukhwinder Singh",
  "Vishal Dadlani",
  "Amit Trivedi",
  "Ankit Tiwari",
  "Sachet Tandon",
  "Parampara Tandon",
  "Palak Muchhal",
  "Monali Thakur",
  "Rekha Bhardwaj",
  "Jasleen Royal",
  "Raghav Chaitanya",
  "Raghav Meattle",
  "When Chai Met Toast",
  "The Local Train",
  "Indian Ocean",
  "Euphoria",
  "Parikrama",
  "Agnee",
  "Advaita",
  "Swarathma",
  "Shankar-Ehsaan-Loy",
  "Salim-Sulaiman",
  "Sachin-Jigar",
  "Ajay-Atul",
  "Tanishk Bagchi",
  "Vayu",
  "OAFF",
  "Savera",
  "Anirudh Ravichander",
  "Sid Sriram",
  "Chinmayi",
  "S. P. Balasubrahmanyam",
  "K. J. Yesudas",
  "Ilaiyaraaja",
  "Dhee",
  "Santhosh Narayanan",
  "Yuvan Shankar Raja",
  "G. V. Prakash Kumar",
  "Vijay Antony",
  "M. M. Keeravani",
  "Shreya Ghoshal Live",
  "The Weeknd",
  "Taylor Swift",
  "Ed Sheeran",
  "Adele",
  "Bruno Mars",
  "Coldplay",
  "Imagine Dragons",
  "Maroon 5",
  "Justin Bieber",
  "Billie Eilish",
  "Dua Lipa",
  "Beyoncé",
  "Rihanna",
  "Drake",
  "Eminem",
  "Post Malone",
  "Shawn Mendes",
  "Selena Gomez",
  "OneRepublic",
  "Linkin Park",
  "Green Day",
  "Calvin Harris",
  "David Guetta",
  "Alan Walker",
  "Martin Garrix",
  "The Chainsmokers",
  "Marshmello",
  "Skrillex",
  "Avicii",
  "Swedish House Mafia",
  "Blackpink",
  "BTS",
  "Stray Kids",
  "TWICE",
  "NewJeans",
  "PSY",
  "Ariana Grande",
  "Lady Gaga",
  "Katy Perry",
  "Miley Cyrus",
  "Harry Styles",
  "Niall Horan",
  "Lana Del Rey",
  "Sabrina Carpenter",
  "Olivia Rodrigo",
  "SZA",
  "Doja Cat",
  "Travis Scott",
  "Kendrick Lamar",
  "J. Cole",
  "Tyler, The Creator",
  "Pitbull",
  "Enrique Iglesias",
  "Shakira",
  "Ricky Martin",
  "Luis Fonsi",
  "Andrea Bocelli",
  "Hans Zimmer",
  "Yo-Yo Ma",
  "Ludovico Einaudi",
  "Yanni",
  "Kenny G",
  "Norah Jones",
  "John Mayer",
  "Foo Fighters",
  "Metallica",
  "The Beatles",
  "Queen",
  "The Rolling Stones",
  "U2",
  "Oasis",
  "Radiohead",
  "Arctic Monkeys",
  "Muse",
  "The Killers",
  "Red Hot Chili Peppers",
  "Pearl Jam",
  "Twenty One Pilots",
  "Fall Out Boy",
  "Panic! At The Disco",
  "Paramore",
  "A. R. Iman",
  "Nora Fatehi",
  "Mouni Roy",
  "Badshah Live",
  "Kapil Sharma",
  "Zakir Khan",
  "Kenny Sebastian",
  "Biswa Kalyan Rath",
  "Vir Das",
  "Aakash Gupta",
  "Anubhav Singh Bassi",
  "Abhishek Upmanyu",
  "Samay Raina",
  "Rahul Subramanian",
  "Kanan Gill",
  "Aditi Mittal",
  "Kusha Kapila",
  "Mallika Dua",
  "Gaurav Kapoor",
  "Atul Khatri",
  "Sorabh Pant",
  "Amit Tandon",
  "Harsh Gujral",
  "Munawar Faruqui",
  "Sunil Grover",
  "Johnny Lever",
  "Raju Srivastava",
  "Pankaj Tripathi",
  "Amit Trivedi Live",
];


/* =====================================================
   CATEGORIES
===================================================== */

const categories = [
  {
    name: "Concerts",
    subtitle: "Live Music",
    icon: Music,
    color: "purple",
  },
  {
    name: "Sports",
    subtitle: "Games & More",
    icon: Trophy,
    color: "blue",
  },
  {
    name: "Theatre",
    subtitle: "Drama & Arts",
    icon: Drama,
    color: "pink",
  },
  {
    name: "Comedy",
    subtitle: "Laugh Out Loud",
    icon: Laugh,
    color: "orange",
  },
  {
    name: "Festivals",
    subtitle: "Food & Culture",
    icon: Tent,
    color: "red",
  },
  {
    name: "Experiences",
    subtitle: "Unique & Exclusive",
    icon: Sparkles,
    color: "gold",
  },
  {
    name: "Exhibitions",
    subtitle: "Art & Lifestyle",
    icon: Palette,
    color: "red",
  },
  {
    name: "Workshops",
    subtitle: "Learn & Grow",
    icon: Mic2,
    color: "purple",
  },
];

/* =====================================================
   TRENDING EVENTS
===================================================== */

const trendingEvents = [
  {
    title: "Sunburn Arena 2026",
    category: "EDM NIGHT",
    date: "25 Apr 2026",
    time: "7:00 PM",
    location: "Mahalaxmi Racecourse",
    city: "Mumbai",
    price: "₹1,999",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=90",
  },
  {
    title: "Mumbai Indians vs CSK",
    category: "SPORTS",
    date: "26 Apr 2026",
    time: "6:00 PM",
    location: "Wankhede Stadium",
    city: "Mumbai",
    price: "₹2,499",
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=90",
  },
  {
    title: "Hamlet – The Musical",
    category: "THEATRE",
    date: "02 May 2026",
    time: "7:30 PM",
    location: "NCPA",
    city: "Mumbai",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=90",
  },
  {
    title: "Stand Up Comedy Fest",
    category: "COMEDY",
    date: "10 May 2026",
    time: "8:00 PM",
    location: "Jio World Garden",
    city: "Mumbai",
    price: "₹999",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=900&q=90",
  },
];

/* =====================================================
   VENUES
===================================================== */

const venues = [
  {
    name: "Jio World Garden",
    city: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=90",
    tags: ["Concerts", "Award Shows", "Corporate"],
  },
  {
    name: "Wankhede Stadium",
    city: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=90",
    tags: ["Sports", "Concerts", "Events"],
  },
  {
    name: "NCPA",
    city: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=90",
    tags: ["Theatre", "Music", "Art"],
  },
];

/* =====================================================
   POPULAR CATEGORIES
===================================================== */

const popularCategories = [
  {
    name: "Concerts",
    subtitle: "Live the Music",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=700&q=90",
  },
  {
    name: "Sports",
    subtitle: "Feel the Energy",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=90",
  },
  {
    name: "Theatre",
    subtitle: "Feel the Drama",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=700&q=90",
  },
  {
    name: "Comedy",
    subtitle: "Laugh Together",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=700&q=90",
  },
  {
    name: "Experiences",
    subtitle: "More Than Just Events",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=90",
  },
];

/* =====================================================
   REVIEWS
===================================================== */

const reviews = [
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text:
      "Booked tickets for Coldplay and the experience was seamless. Best platform for live events!",
  },
  {
    name: "Priya Mehta",
    city: "Bangalore",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text:
      "Amazing UI, easy booking and great seat options. VenueVista is a game changer!",
  },
  {
    name: "Aman Verma",
    city: "Delhi",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    text:
      "Loved the variety of events and the smooth payment process. Will definitely use again!",
  },
];

/* =====================================================
   SECTION TITLE
===================================================== */

function SectionTitle({
  icon,
  title,
  subtitle,
  action = "View All",
  onAction,
}) {
  return (
    <div className="section-title">
      <div className="title-left">
        {icon && (
          <span className="title-icon">
            {icon}
          </span>
        )}

        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>
      </div>

      {action && (
        <button
          type="button"
          className="view-all"
          onClick={onAction}
        >
          {action}
          <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

/* =====================================================
   EVENT CARD
===================================================== */

function EventCard({
  event,
  wishlist,
  setWishlist,
}) {
  const active = wishlist.includes(
    event.title
  );

  const toggleWishlist = () => {
    setWishlist((items) => {
      if (active) {
        return items.filter(
          (item) =>
            item !== event.title
        );
      }

      return [
        ...items,
        event.title,
      ];
    });
  };

  return (
    <article className="event-card">
      <div className="event-image">
        <img
          src={event.image}
          alt={event.title}
        />

        <div className="event-image-shade" />

        <span className="event-label">
          {event.category}
        </span>

        <button
          type="button"
          className={`heart ${
            active ? "active" : ""
          }`}
          onClick={toggleWishlist}
          aria-label={
            active
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={15}
            fill={
              active
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      <div className="event-body">
        <div className="event-date">
          {event.date} • {event.time}
        </div>

        <h3>{event.title}</h3>

        <div className="event-location">
          <MapPin size={12} />
          {event.location}, {event.city}
        </div>

        <div className="event-price">
          <span>From</span>
          <strong>{event.price}</strong>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   CUSTOMER DASHBOARD
   Kept in this original file so the existing project structure stays intact.
===================================================== */

function CustomerDashboard({ user, onBrowseEvents, onMyTickets, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingNotice, setBookingNotice] = useState("");

  useEffect(() => {
    let active = true;
    const loadBookings = async () => {
      setLoadingBookings(true);
      const token = localStorage.getItem("venuevista_auth_token");
      if (!token) {
        if (active) {
          setBookings([]);
          setBookingNotice("Sign in again to load your saved bookings.");
          setLoadingBookings(false);
        }
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/bookings/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.message || "Could not load bookings.");
        }
        const data = payload?.data ?? payload?.bookings ?? payload;
        if (active) {
          setBookings(Array.isArray(data) ? data : Array.isArray(data?.bookings) ? data.bookings : []);
          setBookingNotice("");
        }
      } catch (error) {
        if (active) {
          setBookings([]);
          setBookingNotice("Your booking summary could not be loaded right now. You can still browse events or open My Tickets.");
        }
      } finally {
        if (active) setLoadingBookings(false);
      }
    };

    loadBookings();
    return () => { active = false; };
  }, []);

  const statusOf = (booking) => String(
    booking.paymentStatus || booking.payment?.status || booking.bookingStatus || booking.status || "PENDING"
  ).toUpperCase();
  const confirmed = bookings.filter((booking) => ["CONFIRMED", "SUCCESS", "SUCCEEDED", "PAID", "COMPLETED"].includes(statusOf(booking)));
  const pending = bookings.filter((booking) => ["PENDING", "PROCESSING", "INITIATED"].includes(statusOf(booking)));
  const currency = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(Number(value) || 0);
  const amountOf = (booking) => booking.totalAmount ?? booking.totalPrice ?? booking.total ?? booking.amount ?? booking.price ?? 0;
  const titleOf = (booking) => booking.eventTitle || booking.event?.title || booking.eventName || booking.event?.name || `Booking ${booking.bookingId || booking.id || ""}`;

  const pageStyle = {
    minHeight: "calc(100vh - 72px)", padding: "clamp(24px, 4vw, 56px) 20px 64px",
    color: "#f6f4ef", background: "radial-gradient(ellipse at 15% 0%, rgba(212,160,66,.12), transparent 38%), #050b14",
  };
  const innerStyle = { width: "min(1180px, 100%)", margin: "0 auto" };
  const panelStyle = {
    border: "1px solid rgba(233,190,93,.22)", borderRadius: 18,
    background: "linear-gradient(145deg, rgba(15,26,40,.96), rgba(7,13,22,.96))",
    padding: 22, boxShadow: "0 18px 55px rgba(0,0,0,.18)",
  };
  const buttonStyle = {
    border: "1px solid rgba(239,194,93,.45)", borderRadius: 10, padding: "12px 17px",
    background: "linear-gradient(135deg, #f4d17a, #c88d31)", color: "#10131a",
    fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9,
  };
  const secondaryButtonStyle = {
    ...buttonStyle, color: "#f5d58c", background: "rgba(255,255,255,.035)",
    border: "1px solid rgba(255,255,255,.16)",
  };

  return (
    <main style={pageStyle}>
      <div style={innerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 30 }}>
          <div>
            <div style={{ color: "#e9bd60", fontSize: 12, letterSpacing: ".2em", fontWeight: 700, marginBottom: 10 }}>YOUR VENUEVISTA</div>
            <h1 style={{ margin: 0, fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.12, fontFamily: "Georgia, serif", fontWeight: 500 }}>
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
            </h1>
            <p style={{ color: "#aeb9c8", margin: "12px 0 0", fontSize: 15 }}>Your next unforgettable experience starts here.</p>
          </div>
          <button type="button" style={secondaryButtonStyle} onClick={onLogout}>Sign out</button>
        </div>

        <section style={{ ...panelStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 22 }}>
          <div style={{ padding: "8px 6px" }}>
            <div style={{ color: "#aeb9c8", fontSize: 13, marginBottom: 10 }}>My bookings</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{loadingBookings ? "…" : bookings.length}</div>
            <div style={{ color: "#8492a5", fontSize: 12, marginTop: 6 }}>Bookings returned by your account API</div>
          </div>
          <div style={{ padding: "8px 6px", borderLeft: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ color: "#aeb9c8", fontSize: 13, marginBottom: 10 }}>Confirmed bookings</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#f0c76c" }}>{loadingBookings ? "…" : confirmed.length}</div>
            <div style={{ color: "#8492a5", fontSize: 12, marginTop: 6 }}>Based on returned booking status</div>
          </div>
          <div style={{ padding: "8px 6px", borderLeft: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ color: "#aeb9c8", fontSize: 13, marginBottom: 10 }}>Pending bookings</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{loadingBookings ? "…" : pending.length}</div>
            <div style={{ color: "#8492a5", fontSize: 12, marginTop: 6 }}>Payments or confirmations to check</div>
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 24 }}>
          <article style={panelStyle}>
            <div style={{ color: "#f0c76c", fontSize: 13, letterSpacing: ".12em", marginBottom: 12 }}>DISCOVER SOMETHING NEW</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 25, margin: "0 0 10px" }}>Find your next event</h2>
            <p style={{ color: "#aeb9c8", lineHeight: 1.65, fontSize: 14, margin: "0 0 20px" }}>Explore concerts, sports, theatre, comedy and experiences around you.</p>
            <button type="button" style={buttonStyle} onClick={onBrowseEvents}>Explore events <ArrowRight size={16} /></button>
          </article>
          <article style={panelStyle}>
            <div style={{ color: "#f0c76c", fontSize: 13, letterSpacing: ".12em", marginBottom: 12 }}>YOUR TICKETS, TOGETHER</div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 25, margin: "0 0 10px" }}>Manage your bookings</h2>
            <p style={{ color: "#aeb9c8", lineHeight: 1.65, fontSize: 14, margin: "0 0 20px" }}>Review booking details and check the payment or confirmation status of your tickets.</p>
            <button type="button" style={secondaryButtonStyle} onClick={onMyTickets}>Open My Tickets <Ticket size={16} /></button>
          </article>
        </section>

        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, margin: 0 }}>Recent bookings</h2>
              <p style={{ color: "#8f9caf", fontSize: 13, margin: "7px 0 0" }}>Your account's latest booking records.</p>
            </div>
            <button type="button" style={{ ...secondaryButtonStyle, padding: "9px 13px" }} onClick={onMyTickets}>View all tickets</button>
          </div>
          {bookingNotice && <p role="status" style={{ color: "#e9bd60", fontSize: 13, lineHeight: 1.6 }}>{bookingNotice}</p>}
          {loadingBookings ? <p style={{ color: "#aeb9c8" }}>Loading your bookings…</p> : bookings.length === 0 ? (
            <div style={{ border: "1px dashed rgba(255,255,255,.15)", borderRadius: 12, padding: "25px 18px", textAlign: "center" }}>
              <Ticket size={25} color="#e9bd60" />
              <p style={{ color: "#c0c8d3", margin: "10px 0 15px" }}>No booking records to show yet. Your next experience is waiting.</p>
              <button type="button" style={buttonStyle} onClick={onBrowseEvents}>Browse events <ArrowRight size={16} /></button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {bookings.slice().reverse().slice(0, 5).map((booking, index) => {
                const status = statusOf(booking);
                const good = ["CONFIRMED", "SUCCESS", "SUCCEEDED", "PAID", "COMPLETED"].includes(status);
                return <div key={String(booking.id || booking.bookingId || index)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", padding: "14px 15px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 11, background: "rgba(255,255,255,.018)" }}>
                  <div>
                    <strong style={{ fontSize: 14, fontWeight: 600 }}>{titleOf(booking)}</strong>
                    <div style={{ color: "#8f9caf", fontSize: 12, marginTop: 6 }}>{booking.createdAt || booking.bookingDate ? new Date(booking.createdAt || booking.bookingDate).toLocaleDateString("en-IN") : "Booking date unavailable"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#dce2ea", fontSize: 13 }}>{currency(amountOf(booking))}</span>
                    <span style={{ borderRadius: 99, padding: "5px 9px", fontSize: 10, letterSpacing: ".04em", color: good ? "#a5e6c0" : "#f0c76c", background: good ? "rgba(60,180,115,.12)" : "rgba(240,199,108,.1)" }}>{status}</span>
                  </div>
                </div>;
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* =====================================================
   APP
===================================================== */

/* =====================================================
   ORGANIZER / ADMIN DASHBOARD
   Added inside Main.jsx to preserve the existing project structure.
===================================================== */
function AnalyticsDashboard({ user, onBack, onLogout }) {
  const role = String(user?.role || "CUSTOMER").toUpperCase();
  const isAdmin = role === "ADMIN";
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("daily");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formNotice, setFormNotice] = useState("");
  const [eventForm, setEventForm] = useState({
    title: "", category: "Concerts", description: "", date: "",
    venue: "", city: "", ticketPrice: "", totalTickets: "",
  });

  const token = () => localStorage.getItem("venuevista_auth_token");
  const requestHeaders = () => ({
    "Content-Type": "application/json",
    ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
  });
  const listFrom = (payload) => {
    const value = payload?.data ?? payload?.events ?? payload?.bookings ?? payload;
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.events)) return value.events;
    if (Array.isArray(value?.bookings)) return value.bookings;
    return [];
  };
  const money = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(Number(value) || 0);

  const loadDashboard = async () => {
    setLoading(true);
    setNotice("");
    if (!token()) {
      setEvents([]);
      setAnalytics(null);
      setNotice("Please sign in again to load dashboard data.");
      setLoading(false);
      return;
    }

    try {
      const eventEndpoint = "/api/events/manage";
      const analyticsEndpoint = "/api/bookings/analytics";
      const [eventResponse, analyticsResponse] = await Promise.all([
        fetch(`http://localhost:4000${eventEndpoint}`, { headers: requestHeaders() }),
        fetch(`http://localhost:4000${analyticsEndpoint}?period=${period}`, { headers: requestHeaders() }),
      ]);

      if (eventResponse.ok) {
        const eventPayload = await eventResponse.json().catch(() => ({}));
        setEvents(listFrom(eventPayload));
      } else {
        setEvents([]);
      }

      if (analyticsResponse.ok) {
        const analyticsPayload = await analyticsResponse.json().catch(() => ({}));
        setAnalytics(analyticsPayload?.data ?? analyticsPayload);
      } else {
        setAnalytics(null);
        const analyticsError = await analyticsResponse.clone().json().catch(() => ({}));
        setNotice(
          analyticsResponse.status === 404
            ? "Analytics endpoint was not found. Confirm the backend is running the latest booking routes."
            : analyticsError?.error?.message || analyticsError?.message || "Live sales analytics could not be loaded. Check the backend endpoint and your account permissions."
        );
      }
    } catch (error) {
      setEvents([]);
      setAnalytics(null);
      setNotice("Could not connect to the VenueVista API. Make sure the backend is running on port 4000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, [period, isAdmin]);

  const filteredEvents = events.filter((event) => {
    const text = `${event.title || event.name || ""} ${event.category || ""} ${event.city || ""} ${event.venue || event.location || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });
  // The bookings analytics API returns { summary, sales, events } inside data.
  const stats = analytics?.stats ?? analytics?.summary ?? analytics ?? {};
  const chartRows = Array.isArray(analytics?.sales)
    ? analytics.sales
    : Array.isArray(analytics?.dailySales)
      ? analytics.dailySales
      : Array.isArray(analytics?.salesByDay)
        ? analytics.salesByDay
        : Array.isArray(analytics?.byDay)
          ? analytics.byDay
          : Array.isArray(analytics?.daily)
            ? analytics.daily
            : Array.isArray(analytics?.eventPerformance)
              ? analytics.eventPerformance
              : Array.isArray(analytics?.events)
                ? analytics.events
                : Array.isArray(analytics?.byEvent)
                  ? analytics.byEvent
                  : [];
  const metric = (keys) => {
    for (const key of keys) {
      if (stats[key] !== undefined && stats[key] !== null) return stats[key];
    }
    return null;
  };
  const chartValue = (row) => Number(
    row.revenueInRupees ??
    (row.revenueInPaise != null ? Number(row.revenueInPaise) / 100 : undefined) ??
    row.revenue ?? row.sales ?? row.amount ?? row.ticketsSold ?? 0
  );
  const maxChartValue = Math.max(1, ...chartRows.map(chartValue));
  const graphWidth = 640;
  const graphHeight = 230;
  const graphLeft = 48;
  const graphRight = 14;
  const graphTop = 18;
  const graphBottom = 30;
  const graphUsableWidth = graphWidth - graphLeft - graphRight;
  const graphUsableHeight = graphHeight - graphTop - graphBottom;
  const graphPoints = chartRows.map((row, index) => {
    const x = graphLeft + (chartRows.length <= 1 ? graphUsableWidth / 2 : index * graphUsableWidth / (chartRows.length - 1));
    const y = graphTop + graphUsableHeight - (chartValue(row) / maxChartValue) * graphUsableHeight;
    return { x, y, row, value: chartValue(row) };
  });
  const graphLine = graphPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const graphLabel = (row) => {
    const date = row.date || row.day || row.label || "";
    if (!date) return "";
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString("en-IN", period === "monthly"
      ? { month: "short", year: "2-digit", timeZone: "UTC" }
      : { day: "numeric", month: "short", timeZone: "UTC" });
  };
  const shellStyle = {
    minHeight: "calc(100vh - 72px)", padding: "clamp(22px, 4vw, 48px) 20px 64px",
    background: "radial-gradient(ellipse at 15% 0%, rgba(212,160,66,.12), transparent 38%), #050b14",
    color: "#f6f4ef",
  };
  const panelStyle = {
    border: "1px solid rgba(233,190,93,.2)", borderRadius: 16,
    background: "linear-gradient(145deg, rgba(15,26,40,.96), rgba(7,13,22,.96))",
    padding: 20, minWidth: 0,
  };
  const buttonStyle = {
    border: "1px solid rgba(239,194,93,.45)", borderRadius: 9,
    padding: "10px 14px", background: "linear-gradient(135deg, #f4d17a, #c88d31)",
    color: "#10131a", fontWeight: 700, cursor: "pointer",
  };
  const inputStyle = {
    width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 9,
    border: "1px solid rgba(255,255,255,.13)", background: "#091321", color: "#f6f4ef",
  };

  const submitEvent = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormNotice("");
    try {
      const response = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify({
          title: eventForm.title.trim(),
          category: eventForm.category,
          description: eventForm.description.trim(),
          venue: eventForm.venue.trim(),
          city: eventForm.city.trim(),
          startsAt: new Date(`${eventForm.date}T19:00:00`).toISOString(),
          priceInPaise: Math.round(Number(eventForm.ticketPrice) * 100),
          totalTickets: Number(eventForm.totalTickets),
          isPublished: true,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error?.message || payload?.message || "Event could not be created.");
      setFormNotice("Event submitted successfully.");
      setEventForm({ title: "", category: "Concerts", description: "", date: "", venue: "", city: "", ticketPrice: "", totalTickets: "" });
      setShowCreateForm(false);
      await loadDashboard();
    } catch (error) {
      setFormNotice(error.message || "Could not create the event. Check the backend and your role permissions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={shellStyle}>
      <div style={{ width: "min(1180px, 100%)", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ color: "#e9bd60", fontSize: 11, letterSpacing: ".2em", fontWeight: 700, marginBottom: 8 }}>VENUEVISTA • {isAdmin ? "PLATFORM CONTROL" : "EVENT MANAGEMENT"}</div>
            <h1 style={{ margin: 0, fontSize: "clamp(27px, 4vw, 38px)", fontFamily: "Georgia, serif", fontWeight: 500 }}>{isAdmin ? "Admin Dashboard" : "Organizer Dashboard"}</h1>
            <p style={{ color: "#aeb9c8", margin: "9px 0 0", fontSize: 14 }}>Welcome{user?.firstName ? `, ${user.firstName}` : ""}. Review events and performance.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            <button type="button" style={{ ...buttonStyle, background: "rgba(255,255,255,.04)", color: "#f0c76c", borderColor: "rgba(255,255,255,.16)" }} onClick={onBack}>Back to home</button>
            {!isAdmin && <button type="button" style={buttonStyle} onClick={() => { setShowCreateForm((value) => !value); setFormNotice(""); }}>+ Create Event</button>}
            <button type="button" style={{ ...buttonStyle, background: "transparent", color: "#e8edf5", borderColor: "rgba(255,255,255,.16)" }} onClick={onLogout}>Sign out</button>
          </div>
        </div>

        {notice && <div role="status" style={{ ...panelStyle, color: "#f0c76c", fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>{notice}</div>}
        {formNotice && <div role="status" style={{ ...panelStyle, color: "#f0c76c", fontSize: 13, marginBottom: 18 }}>{formNotice}</div>}

        {showCreateForm && !isAdmin && (
          <form onSubmit={submitEvent} style={{ ...panelStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 20 }}>
            <h2 style={{ gridColumn: "1 / -1", margin: 0, fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 22 }}>Create an event</h2>
            <input style={inputStyle} placeholder="Event title" value={eventForm.title} required onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
            <select style={inputStyle} value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}><option>Concerts</option><option>Sports</option><option>Theatre</option><option>Comedy</option><option>Festivals</option><option>Experiences</option><option>Exhibitions</option><option>Workshops</option></select>
            <input style={inputStyle} type="date" min={new Date().toISOString().slice(0, 10)} value={eventForm.date} required onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
            <input style={inputStyle} placeholder="Venue" value={eventForm.venue} required onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} />
            <input style={inputStyle} placeholder="City" value={eventForm.city} required onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })} />
            <input style={inputStyle} type="number" min="0" placeholder="Ticket price (₹)" value={eventForm.ticketPrice} required onChange={(e) => setEventForm({ ...eventForm, ticketPrice: e.target.value })} />
            <input style={inputStyle} type="number" min="1" step="1" placeholder="Total tickets" value={eventForm.totalTickets} required onChange={(e) => setEventForm({ ...eventForm, totalTickets: e.target.value })} />
            <textarea style={{ ...inputStyle, gridColumn: "1 / -1", minHeight: 86, resize: "vertical" }} placeholder="Event description" value={eventForm.description} required onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, flexWrap: "wrap" }}><button type="submit" disabled={saving} style={{ ...buttonStyle, opacity: saving ? .7 : 1 }}>{saving ? "Saving…" : "Save event"}</button><button type="button" style={{ ...buttonStyle, background: "transparent", color: "#e8edf5", borderColor: "rgba(255,255,255,.16)" }} onClick={() => setShowCreateForm(false)}>Cancel</button></div>
          </form>
        )}

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 13, marginBottom: 20 }}>
          {[
            { label: isAdmin ? "Total events" : "My events", value: loading ? "…" : (metric(["totalEvents", "eventCount"]) ?? events.length), detail: "Events available from the API" },
            { label: isAdmin ? "Total bookings" : "Tickets sold", value: loading ? "…" : (metric(["totalBookings", "totalTicketsBooked", "totalTicketsSold", "ticketsSold", "bookingsCount"]) ?? "—"), detail: "Bookings in the selected analytics window" },
            { label: "Confirmed sales", value: loading ? "…" : (metric(["confirmedBookings", "confirmedTicketsSold", "confirmedSales", "confirmedCount"]) ?? "—"), detail: "Confirmed booking and ticket records" },
            { label: "Revenue", value: loading ? "…" : (metric(["totalRevenueInRupees", "totalRevenue", "revenue", "confirmedRevenue"]) !== null ? money(metric(["totalRevenueInRupees", "totalRevenue", "revenue", "confirmedRevenue"])) : "—"), detail: "Successful payments only" },
          ].map((item) => (
            <article key={item.label} style={panelStyle}>
              <div style={{ color: "#aeb9c8", fontSize: 12, marginBottom: 12 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f0c76c", overflowWrap: "anywhere" }}>{item.value}</div>
              <div style={{ color: "#8492a5", fontSize: 11, lineHeight: 1.5, marginTop: 8 }}>{item.detail}</div>
            </article>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 18, marginBottom: 20 }}>
          <article style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 21 }}>Sales analytics</h2>
              <select aria-label="Analytics period" style={{ ...inputStyle, width: "auto", padding: "8px 10px" }} value={period} onChange={(e) => setPeriod(e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
            </div>
            {chartRows.length ? <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ color: "#8f9caf", fontSize: 12 }}>Revenue over time</span>
                <strong style={{ color: "#f0c76c", fontSize: 13 }}>{money(chartRows.reduce((sum, row) => sum + chartValue(row), 0))}</strong>
              </div>
              <svg role="img" aria-label={`${period} revenue line chart`} viewBox={`0 0 ${graphWidth} ${graphHeight}`} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
                {[0, 0.5, 1].map((fraction) => {
                  const y = graphTop + graphUsableHeight * fraction;
                  const amount = maxChartValue * (1 - fraction);
                  return <g key={fraction}>
                    <line x1={graphLeft} y1={y} x2={graphWidth - graphRight} y2={y} stroke="rgba(255,255,255,.12)" strokeDasharray="4 5" />
                    <text x={graphLeft - 8} y={y + 4} textAnchor="end" fill="#8f9caf" fontSize="10">{amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : Math.round(amount)}</text>
                  </g>;
                })}
                <polyline points={graphLine} fill="none" stroke="#f0c76c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {graphPoints.map((point, index) => <g key={`${point.row.date || index}-point`}>
                  <circle cx={point.x} cy={point.y} r="4" fill="#f0c76c" stroke="#101b2b" strokeWidth="2"><title>{`${graphLabel(point.row)}: ${money(point.value)}`}</title></circle>
                  {(chartRows.length <= 8 || index % 2 === 0 || index === chartRows.length - 1) && <text x={point.x} y={graphHeight - 7} textAnchor="middle" fill="#aeb9c8" fontSize="10">{graphLabel(point.row)}</text>}
                </g>)}
              </svg>
              {chartRows.every((row) => chartValue(row) === 0) && <p style={{ color: "#8f9caf", fontSize: 12, margin: "4px 0 0" }}>No successful-payment revenue in this period. The zero line is real data, not a sample.</p>}
            </div> : <p style={{ color: "#8f9caf", fontSize: 13, lineHeight: 1.6, marginBottom: 0 }}>No sales timeline returned. Check the analytics API response and backend logs.</p>}
          </article>

          <article style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 21 }}>{isAdmin ? "Platform events" : "Manage my events"}</h2>
              <span style={{ color: "#8f9caf", fontSize: 12 }}>{filteredEvents.length} shown</span>
            </div>
            <input style={{ ...inputStyle, marginBottom: 14 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, category or city…" />
            {loading ? <p style={{ color: "#aeb9c8", fontSize: 13 }}>Loading dashboard…</p> : filteredEvents.length === 0 ? <p style={{ color: "#8f9caf", fontSize: 13, lineHeight: 1.6 }}>No event records returned. If events exist, check the role-scoped events endpoint in the backend.</p> : <div style={{ display: "grid", gap: 10 }}>
              {filteredEvents.slice(0, 8).map((event, index) => <div key={String(event.id || event.eventId || index)} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.07)" }}><div style={{ minWidth: 0 }}><strong style={{ display: "block", fontSize: 13, overflowWrap: "anywhere" }}>{event.title || event.name || "Untitled event"}</strong><span style={{ color: "#8f9caf", display: "block", fontSize: 11, marginTop: 5 }}>{[event.category, event.city || event.location || event.venue].filter(Boolean).join(" • ") || "Event details unavailable"}</span></div><span style={{ color: "#f0c76c", fontSize: 12, whiteSpace: "nowrap" }}>{event.priceInRupees != null ? money(event.priceInRupees) : event.ticketPrice != null ? money(event.ticketPrice) : event.price != null ? String(event.price) : "—"}</span></div>)}
            </div>}
          </article>
        </section>
        <p style={{ color: "#718096", fontSize: 11, lineHeight: 1.6 }}>Live revenue, ticket sales and organizer ownership depend on backend endpoints enforcing ADMIN/ORGANIZER permissions. The dashboard does not invent missing sales figures.</p>
      </div>
    </main>
  );
}

function App() {
  const [menu, setMenu] =
    useState(false);

  const [wishlist, setWishlist] =
    useState([]);

  const [query, setQuery] =
    useState("");

  const [searchCity, setSearchCity] =
    useState("");

  const [searchCountry, setSearchCountry] =
    useState("");

  const [searchDate, setSearchDate] =
    useState("");

  const [searchCategory, setSearchCategory] =
    useState("All Events");

  const [activeHeroSlide, setActiveHeroSlide] =
    useState(0);

  const activeHero = heroSlides[activeHeroSlide];

  /* =====================================================
     PAGE STATE
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState("home");

  /* =====================================================
     AUTHENTICATION STATE
  ===================================================== */

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  /* =====================================================
     RESTORE CURRENT SESSION
  ===================================================== */

  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        "venuevista_current_user"
      );

    if (!savedUser) {
      return;
    }

    try {
      const parsedUser =
        JSON.parse(savedUser);

      if (
        parsedUser &&
        parsedUser.email
      ) {
        setUser(parsedUser);
      }
    } catch (error) {
      console.error(
        "Unable to restore VenueVista session:",
        error
      );

      localStorage.removeItem(
        "venuevista_current_user"
      );
    }
  }, []);

  /* =====================================================
     OPEN EVENTS
  ===================================================== */

  const openEvents = () => {
    setCurrentPage("events");
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEventsWithQuery = (value) => {
    setQuery(value);
    setSearchCategory("All Events");
    setCurrentPage("events");
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEventsWithCategory = (value) => {
    setSearchCategory(value === "Workshops" ? "Experiences" : (value || "All Events"));
    setCurrentPage("events");
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSection = (id) => {
    setCurrentPage("home");
    setMenu(false);
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };

  /* =====================================================
     OPEN MY TICKETS
  ===================================================== */

  const openMyTickets = () => {
    setCurrentPage("my-tickets");
    setMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     OPEN HOME
  ===================================================== */

  const openHome = () => {
    setCurrentPage("home");
    setMenu(false);

    setTimeout(() => {
      document
        .getElementById("home")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =====================================================
     OPEN LOGIN
  ===================================================== */

  const openLogin = () => {
    setCurrentPage("login");
    setMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     OPEN REGISTER
  ===================================================== */

  const openRegister = () => {
    setCurrentPage("register");
    setMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     AFTER LOGIN
  ===================================================== */

  const handleLogin = (loggedInUser) => {
    if (!loggedInUser) {
      return;
    }

    setUser(loggedInUser);

    /*
     * Save current active session.
     */
    localStorage.setItem(
      "venuevista_current_user",
      JSON.stringify(loggedInUser)
    );

    const role = String(loggedInUser.role || "CUSTOMER").toUpperCase();
    setCurrentPage(role === "CUSTOMER" ? "customer-dashboard" : "analytics-dashboard");
    setMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     AFTER REGISTER
  ===================================================== */

  const handleRegister = (
    registeredUser
  ) => {
    if (!registeredUser) {
      return;
    }

    /*
     * Register.jsx already saves the
     * registered account and current user.
     *
     * We also save it here so main.jsx
     * remains the single source of truth.
     */
    setUser(registeredUser);

    localStorage.setItem(
      "venuevista_current_user",
      JSON.stringify(registeredUser)
    );

    setCurrentPage("home");
    setMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    // Clear the active session token as well as the cached user.
    localStorage.removeItem("venuevista_auth_token");
    /*
     * IMPORTANT:
     *
     * Only remove the CURRENT SESSION.
     *
     * Do NOT remove:
     * venuevista_registered_user
     *
     * This is what allows the user to login
     * again after logout.
     */
    localStorage.removeItem(
      "venuevista_current_user"
    );

    setUser(null);
    setMenu(false);
    setCurrentPage("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     SCROLL TO HOME SECTION
  ===================================================== */

  const scrollTo = (id) => {
    setCurrentPage("home");
    setMenu(false);

    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =====================================================
     CUSTOMER DASHBOARD PAGE
  ===================================================== */

  if (currentPage === "customer-dashboard") {
    return (
      <>
        <SiteNav user={user} onHome={openHome} onEvents={openEvents}
          onTickets={openMyTickets} onLogin={openLogin} onLogout={handleLogout}
          onSection={openSection} />
        <CustomerDashboard
          user={user}
          onBrowseEvents={openEvents}
          onMyTickets={openMyTickets}
          onLogout={handleLogout}
        />
      </>
    );
  }

  /* =====================================================
     ORGANIZER / ADMIN ANALYTICS PAGE
  ===================================================== */

  if (currentPage === "analytics-dashboard") {
    return <AnalyticsDashboard user={user} onBack={openHome} onLogout={handleLogout} />;
  }

  /* =====================================================
     EVENTS PAGE
  ===================================================== */

  if (currentPage === "events") {
    return (
      <>
        <SiteNav user={user} onHome={openHome} onEvents={openEvents}
          onTickets={openMyTickets} onLogin={openLogin} onLogout={handleLogout}
          onSection={openSection} />
        <div className="route-page-shell">
          <Events
            onBack={openHome}
            user={user}
            initialFilters={{ query, city: searchCity, country: searchCountry, date: searchDate, category: searchCategory }}
          />
        </div>
      </>
    );
  }

  /* =====================================================
     MY TICKETS PAGE
  ===================================================== */

  if (currentPage === "my-tickets") {
    return (
      <>
        <SiteNav user={user} onHome={openHome} onEvents={openEvents}
          onTickets={openMyTickets} onLogin={openLogin} onLogout={handleLogout}
          onSection={openSection} />
        <div className="route-page-shell">
          <MyTickets onBack={openHome} onBrowseEvents={openEvents} user={user} />
        </div>
      </>
    );
  }

  /* =====================================================
     LOGIN PAGE
  ===================================================== */

  if (currentPage === "login") {
    return (
      <>
        <SiteNav user={user} onHome={openHome} onEvents={openEvents}
          onTickets={openMyTickets} onLogin={openLogin} onLogout={handleLogout}
          onSection={openSection} />
        <div className="route-page-shell">
          <Login onBack={openHome} onLogin={handleLogin} onCreateAccount={openRegister} />
        </div>
      </>
    );
  }

  /* =====================================================
     REGISTER PAGE
  ===================================================== */

  if (currentPage === "register") {
    return (
      <>
        <SiteNav user={user} onHome={openHome} onEvents={openEvents}
          onTickets={openMyTickets} onLogin={openLogin} onLogout={handleLogout}
          onSection={openSection} />
        <div className="route-page-shell">
          <Register onBack={openHome} onLogin={openLogin} onRegister={handleRegister} />
        </div>
      </>
    );
  }

  /* =====================================================
     HOME PAGE
  ===================================================== */

  return (
    <div className="site">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        <div className="container nav-container">

          <button
            type="button"
            className="logo"
            onClick={() =>
              scrollTo("home")
            }
          >
            <span className="logo-v">
              V
            </span>

            <span className="logo-text">
              <strong>
                VenueVista
              </strong>

              <small>
                Events. Venues. Experiences.
              </small>
            </span>
          </button>

          <nav
            className={`nav-menu ${
              menu ? "show" : ""
            }`}
          >

            <button
              type="button"
              className="active"
              onClick={() =>
                scrollTo("home")
              }
            >
              Home
            </button>

            <button
              type="button"
              onClick={openEvents}
            >
              Events
            </button>

            <button
              type="button"
              onClick={openEvents}
            >
              Concerts
            </button>

            <button
              type="button"
              onClick={openEvents}
            >
              Sports
            </button>

            <button
              type="button"
              onClick={openEvents}
            >
              Theatre
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo("categories")
              }
            >
              Experiences
            </button>

            <button
              type="button"
              onClick={() =>
                scrollTo("venues")
              }
            >
              Venues
            </button>

          </nav>

          <div className="nav-right">

            <button
              type="button"
              className="nav-search"
              onClick={() =>
                scrollTo("search")
              }
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            <button
              type="button"
              className="tickets-link"
              onClick={openMyTickets}
            >
              <Ticket size={13} />
              My Tickets
            </button>

            {/* =================================================
                LOGGED OUT / LOGGED IN
            ================================================= */}

            {!user ? (

              <button
                type="button"
                className="login-button"
                onClick={openLogin}
              >
                Login
              </button>

            ) : (

              <div className="nav-user-area">

                <button
                  type="button"
                  className="nav-user-button"
                >

                  <span className="nav-user-avatar">
                    {(
                      user.firstName ||
                      user.fullName ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className="nav-user-name">
                    {user.firstName ||
                      user.fullName ||
                      "User"}
                  </span>

                  <span className="nav-user-arrow">
                    ▾
                  </span>

                </button>

                <div className="nav-user-dropdown">

                  <div className="nav-user-details">

                    <span className="nav-dropdown-avatar">
                      {(
                        user.firstName ||
                        user.fullName ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                    <div>

                      <strong>
                        {user.fullName ||
                          `${user.firstName || ""} ${
                            user.lastName || ""
                          }`.trim() ||
                          "User"}
                      </strong>

                      <small>
                        {user.email}
                      </small>

                    </div>

                  </div>

                  <div className="nav-dropdown-line" />

                  {["ADMIN", "ORGANIZER"].includes(String(user.role || "").toUpperCase()) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage("analytics-dashboard");
                        setMenu(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {String(user.role).toUpperCase() === "ADMIN" ? "Admin Dashboard" : "Organizer Dashboard"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={openMyTickets}
                  >
                    <Ticket size={14} />
                    My Tickets
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                  >
                    Logout
                  </button>

                </div>

              </div>

            )}

            <button
              type="button"
              className="list-button"
              onClick={() =>
                scrollTo("cta")
              }
            >
              List Your Event
            </button>

            <button
              type="button"
              className="mobile-toggle"
              onClick={() =>
                setMenu(!menu)
              }
              aria-label="Toggle menu"
            >
              {menu ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        id="home"
        className="hero"
      >

        <div className="hero-image">

          <img
            src={activeHero.image}
            alt={`${activeHero.artist} featured event`}
          />

        </div>

        <div className="hero-dark" />

        <div className="hero-vignette" />

        <div className="hero-content container">

          <div className="hero-copy">

            <span className="hero-kicker">
              {activeHero.kicker}
            </span>

            <h1>
              {activeHero.artist}
            </h1>

            <p className="hero-tagline">
              {activeHero.tagline}
            </p>

            <div className="hero-meta">

              <span>
                <CalendarDays size={13} />
                {activeHero.date}
              </span>

              <span>
                <MapPin size={13} />
                {activeHero.venue}
              </span>

            </div>

            <div className="hero-buttons">

              <button
                type="button"
                className="gold-button"
                onClick={() => openEventsWithQuery(activeHero.artist)}
              >
                Book Tickets
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                className="dark-button"
                onClick={() => openEventsWithQuery(activeHero.artist)}
              >
                View Details
              </button>

            </div>

          </div>

          <div className="hero-side-text">
            <span>Music</span>
            <span>Connects</span>
            <span>Us</span>
          </div>

          <div className="hero-counter">

            <span>
              {String(activeHeroSlide + 1).padStart(2, "0")}
            </span>

            <small>
              / {String(heroSlides.length).padStart(2, "0")}
            </small>

            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setActiveHeroSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
            >
              ‹
            </button>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length)}
            >
              ›
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          SEARCH
      ================================================= */}

      <section
        id="search"
        className="search-wrapper"
      >

        <div className="container">

          <div className="search-box">

            <div className="search-heading">

              <h2>
                Find Your Next Experience
              </h2>

              <p>
                Search from thousands of events,
                concerts, sports, theatre and more...
              </p>

            </div>

            <div className="search-fields">

              <div className="search-input">

                <Search size={16} />

                <input
                  type="text"
                  placeholder="Event, Artist, Venue..."
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      e.target.value
                    )
                  }
                />

              </div>

              <label className="select-input search-select-wrap">
                <MapPin size={16} />
                <input
                  aria-label="Search any country"
                  type="search"
                  placeholder="Any country (e.g. India, Japan, USA)"
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  list="venuevista-country-suggestions"
                />
                <datalist id="venuevista-country-suggestions">
                  {[
                    "India", "United States", "United Kingdom", "Canada",
                    "Australia", "Japan", "Singapore", "United Arab Emirates",
                    "France", "Germany", "Italy", "Spain", "Brazil",
                    "South Korea", "Thailand", "Indonesia", "Malaysia",
                    "New Zealand", "South Africa", "Saudi Arabia", "Qatar",
                    "Netherlands", "Switzerland", "Ireland", "Mexico"
                  ].map((country) => <option key={country} value={country} />)}
                </datalist>
              </label>

              <label className="select-input search-select-wrap">
                <MapPin size={16} />
                <input
                  aria-label="Search any city"
                  type="search"
                  placeholder="Any city (e.g. Delhi, London, Tokyo)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  list="venuevista-city-suggestions"
                />
                <datalist id="venuevista-city-suggestions">
                  {[
                    "Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad",
                    "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Lucknow",
                    "New York", "Los Angeles", "London", "Paris", "Tokyo",
                    "Dubai", "Singapore", "Toronto", "Sydney", "Melbourne",
                    "Berlin", "Rome", "Barcelona", "Amsterdam", "Bangkok",
                    "Seoul", "Hong Kong", "Cape Town", "São Paulo", "Auckland"
                  ].map((city) => <option key={city} value={city} />)}
                </datalist>
              </label>

              <label className="select-input search-select-wrap">
                <CalendarDays size={16} />
                <input aria-label="Select date" type="date" value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)} />
              </label>

              <button
                type="button"
                className="search-button"
                onClick={() => {
                  setCurrentPage("events");
                  setMenu(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Search
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORY STRIP
      ================================================= */}

      <section
        id="categories"
        className="category-strip"
      >

        <div className="container category-grid">

          {categories.map((item) => {

            const Icon = item.icon;

            return (
              <button
                type="button"
                className="category-item"
                key={item.name}
                onClick={() => openEventsWithCategory(item.name)}
              >

                <div
                  className={`category-icon ${item.color}`}
                >
                  <Icon size={22} />
                </div>

                <strong>
                  {item.name}
                </strong>

                <small>
                  {item.subtitle}
                </small>

              </button>
            );

          })}

        </div>

      </section>

      {/* =================================================
          TRENDING
      ================================================= */}

      <section
        id="events"
        className="content-section"
      >

        <div className="container">

          {query.trim() && popularArtists.some((artist) =>
            artist.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
          ) && (
            <section id="artists" className="artists-section">
              <div className="artists-results-panel">
                <div className="artists-results-copy">
                  <span className="artists-eyebrow">QUICK SEARCH</span>
                  <h2>Artists matching <span>“{query.trim()}”</span></h2>
                  <p>Choose an artist to find matching events.</p>
                </div>
                <button
                  type="button"
                  className="artist-browse-button"
                  onClick={() => openEventsWithQuery(query.trim())}
                >
                  Search all events <ArrowRight size={15} />
                </button>
              </div>
              <div className="artist-chip-grid">
                {popularArtists
                  .filter((artist) =>
                    artist.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
                  )
                  .slice(0, 8)
                  .map((artist) => (
                    <button
                      type="button"
                      key={artist}
                      className="artist-chip"
                      onClick={() => openEventsWithQuery(artist)}
                    >
                      <Music2 size={14} />
                      <span>{artist}</span>
                      <ArrowRight className="artist-chip-arrow" size={13} />
                    </button>
                  ))}
              </div>
            </section>
          )}

      <SectionTitle
            icon="♨"
            title="Trending Near You"
            subtitle="Most popular events in your city right now"
            onAction={openEvents}
          />

          <div className="events-grid">

            {trendingEvents.map(
              (event) => (
                <EventCard
                  key={event.title}
                  event={event}
                  wishlist={wishlist}
                  setWishlist={
                    setWishlist
                  }
                />
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          FEATURED + VENUES
      ================================================= */}

      <section className="content-section featured-area">

        <div className="container featured-grid">

          <article className="featured-event">

            <img
              src="https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1300&q=95"
              alt="Coldplay concert"
            />

            <div className="featured-event-shade" />

            <div className="featured-event-content">

              <span className="mini-label">
                LIVE MUSIC
              </span>

              <h2>
                Coldplay
              </h2>

              <p>
                Music of the Spheres World Tour
              </p>

              <div className="featured-details">

                <span>
                  <CalendarDays size={13} />
                  21 Jan 2026 • 7:00 PM
                </span>

                <span>
                  <MapPin size={13} />
                  DY Patil Stadium,
                  Navi Mumbai
                </span>

              </div>

              <strong className="featured-price">
                From ₹2,999
              </strong>

              <div className="featured-buttons">

                <button
                  type="button"
                  className="gold-button"
                  onClick={openEvents}
                >
                  Book Now
                </button>

                <button
                  type="button"
                  className="watch-button"
                >
                  <Play size={12} />
                  Watch Trailer
                </button>

              </div>

            </div>

          </article>

          <div
            id="venues"
            className="venues-column"
          >

            <SectionTitle
              icon="▣"
              title="Featured Venues"
              subtitle="Iconic venues for unforgettable moments"
            />

            <div className="venue-list">

              {venues.map(
                (venue) => (
                  <article
                    className="venue-item"
                    key={venue.name}
                  >

                    <img
                      src={venue.image}
                      alt={venue.name}
                    />

                    <div className="venue-info">

                      <h3>
                        {venue.name}
                      </h3>

                      <span className="venue-city">
                        <MapPin size={10} />
                        {venue.city}
                      </span>

                      <div className="venue-tags">

                        {venue.tags.map(
                          (tag) => (
                            <span
                              key={tag}
                            >
                              {tag}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          POPULAR CATEGORIES
      ================================================= */}

      <section className="content-section popular-section">

        <div className="container">

          <SectionTitle
            icon="☆"
            title="Popular Categories"
            subtitle="Explore events by your interest"
            action=""
          />

          <div className="popular-grid">

            {popularCategories.map(
              (item) => (
                <article
                  className="popular-card"
                  key={item.name}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="popular-shade" />

                  <div className="popular-content">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {item.subtitle}
                    </p>

                  </div>

                </article>
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          WHY VENUEVISTA
      ================================================= */}

      <section className="content-section why-section">

        <div className="container">

          <div className="why-box">

            <img
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=90"
              alt="VenueVista events"
            />

            <div className="why-shade" />

            <div className="why-text">

              <h2>
                Why Choose VenueVista?
              </h2>

              <p>
                More events. Better seats.
                Unforgettable experiences.
              </p>

            </div>

            <div className="stats">

              <div className="stat">

                <span>
                  <Ticket size={17} />
                </span>

                <strong>
                  10K+
                </strong>

                <small>
                  Events
                </small>

              </div>

              <div className="stat">

                <span>
                  <Building2 size={17} />
                </span>

                <strong>
                  500+
                </strong>

                <small>
                  Venues
                </small>

              </div>

              <div className="stat">

                <span>
                  <Users size={17} />
                </span>

                <strong>
                  2M+
                </strong>

                <small>
                  Happy Users
                </small>

              </div>

              <div className="stat">

                <span>
                  <Star size={17} />
                </span>

                <strong>
                  4.8 ★
                </strong>

                <small>
                  Average Rating
                </small>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          REVIEWS
      ================================================= */}

      <section className="content-section reviews-section">

        <div className="container">

          <SectionTitle
            icon="☻"
            title="What Our Users Say"
            subtitle="Real experiences. Real stories."
          />

          <div className="review-grid">

            {reviews.map(
              (review) => (
                <article
                  className="review-card"
                  key={review.name}
                >

                  <div className="review-user">

                    <img
                      src={review.image}
                      alt={review.name}
                    />

                    <div>

                      <strong>
                        {review.name}
                      </strong>

                      <small>
                        {review.city}
                      </small>

                    </div>

                  </div>

                  <div className="review-stars">
                    ★★★★★
                  </div>

                  <p>
                    "{review.text}"
                  </p>

                </article>
              )
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section
        id="cta"
        className="cta"
      >

        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=90"
          alt="Event crowd"
        />

        <div className="cta-shade" />

        <div className="container cta-content">

          <div>

            <span>
              Your Next
            </span>

            <strong>
              Unforgettable Moment
            </strong>

            <strong>
              is Just a Click Away
            </strong>

            <small>
              Discover. Book. Experience.
            </small>

          </div>

          <button
            type="button"
            className="gold-button"
            onClick={openEvents}
          >
            Explore Events
            <ArrowRight size={14} />
          </button>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <div className="container">

          <div className="footer-grid">

            <div className="footer-brand">

              <div className="logo">

                <span className="logo-v">
                  V
                </span>

                <span className="logo-text">

                  <strong>
                    VenueVista
                  </strong>

                  <small>
                    Events. Venues. Experiences.
                  </small>

                </span>

              </div>

            </div>

            <div className="footer-column">

              <h4>
                Quick Links
              </h4>

              <button
                onClick={() =>
                  scrollTo("home")
                }
              >
                Home
              </button>

              <button
                onClick={openEvents}
              >
                Events
              </button>

              <button
                onClick={() =>
                  scrollTo("venues")
                }
              >
                Venues
              </button>

              <button
                onClick={openMyTickets}
              >
                My Tickets
              </button>

              <button
                onClick={() =>
                  scrollTo("cta")
                }
              >
                Help & Support
              </button>

            </div>

            <div className="footer-column">

              <h4>
                Categories
              </h4>

              <button
                onClick={openEvents}
              >
                Concerts
              </button>

              <button
                onClick={openEvents}
              >
                Sports
              </button>

              <button
                onClick={openEvents}
              >
                Theatre
              </button>

              <button
                onClick={openEvents}
              >
                Comedy
              </button>

              <button
                onClick={openEvents}
              >
                Festivals
              </button>

              <button
                onClick={openEvents}
              >
                Experiences
              </button>

            </div>

            <div className="footer-column">

              <h4>
                For Organizers
              </h4>

              <button
                onClick={() =>
                  scrollTo("cta")
                }
              >
                List Your Event
              </button>

              <button
                onClick={openLogin}
              >
                Organizer Login
              </button>

              <button
                onClick={() =>
                  scrollTo("cta")
                }
              >
                Resources
              </button>

              <button
                onClick={() =>
                  scrollTo("cta")
                }
              >
                Partner With Us
              </button>

            </div>

            <div className="footer-social">

              <h4>
                Stay Connected
              </h4>

              <div className="social-icons">

                <a href="#">
                  ◎
                </a>

                <a href="#">
                  𝕏
                </a>

                <a href="#">
                  f
                </a>

                <a href="#">
                  ▶
                </a>

                <a href="#">
                  in
                </a>

              </div>

              <div className="subscribe">

                <input
                  type="email"
                  placeholder="Enter your email"
                />

                <button
                  type="button"
                >
                  Subscribe
                </button>

              </div>

            </div>

          </div>

          <div className="footer-bottom">

            <span>
              © 2026 VenueVista.
              All rights reserved.
            </span>

            <div>

              <a href="#">
                Privacy Policy
              </a>

              <a href="#">
                Terms of Service
              </a>

              <a href="#">
                Contact Us
              </a>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

/* =====================================================
   RENDER
===================================================== */

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);