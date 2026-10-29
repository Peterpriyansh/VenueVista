import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  Heart,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";

import EventDetails from "./EventDetails";

const eventFallbackImages = {
  Music: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=85",
  Festival: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85",
  Technology: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85",
  Food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1400&q=85",
  Art: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=85",
  Workshop: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85",
  Nightlife: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=85",
  Sports: "https://images.unsplash.com/photo-1461896836934-172b5fc0f4b3?auto=format&fit=crop&w=1400&q=85",
  Theatre: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1400&q=85",
  Comedy: "https://images.unsplash.com/photo-1585699324551-f6c309e5b4a5?auto=format&fit=crop&w=1400&q=85",
};

const universalFallbackImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85";

const formatApiEvent = (event) => {
  const categoryMap = {
    Music: "Concerts",
    Festival: "Festivals",
    Technology: "Experiences",
    Food: "Experiences",
    Art: "Exhibitions",
    Workshop: "Experiences",
    Nightlife: "Experiences",
    Sports: "Sports",
    Theatre: "Theatre",
    Comedy: "Comedy",
  };

  const startDate = event.startsAt ? new Date(event.startsAt) : null;
  const validDate = startDate && !Number.isNaN(startDate.getTime());

  return {
    ...event,
    id: event.id,
    title: event.title || "Untitled event",
    category: categoryMap[event.category] || event.category || "Experiences",
    city: event.city || "",
    country:
      event.country ||
      event.countryName ||
      event.venueCountry ||
      ([
        "Delhi", "New Delhi", "Mumbai", "Bengaluru", "Bangalore", "Pune",
        "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Lucknow",
        "Noida", "Gurugram", "Gurgaon", "Ghaziabad", "Indore", "Bhopal",
        "Chandigarh", "Kochi", "Goa", "Surat", "Nagpur", "Patna",
        "Varanasi", "Amritsar", "Dehradun", "Thiruvananthapuram"
      ].some((name) => String(event.city || "").toLowerCase() === name.toLowerCase())
        ? "India"
        : ""),
    date: validDate
      ? startDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Date to be announced",
    time: validDate
      ? startDate.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
        })
      : "",
    price: Number(event.priceInPaise ?? event.price ?? 0) / (
      event.priceInPaise != null ? 100 : 1
    ),
    venue:
      event.venueName ||
      event.venue ||
      event.location ||
      event.city ||
      "Venue to be announced",
    location:
      event.location ||
      event.venueName ||
      event.venue ||
      event.city ||
      "Location to be announced",
    image:
      event.imageUrl ||
      event.image ||
      eventFallbackImages[event.category] ||
      universalFallbackImage,
    fallbackImage:
      eventFallbackImages[event.category] || universalFallbackImage,
    featured: Boolean(event.featured),
  };
};

const categories = [
  "All Events",
  "Concerts",
  "Sports",
  "Theatre",
  "Comedy",
  "Festivals",
  "Experiences",
  "Exhibitions",
];

const priceFilters = [
  "All Prices",
  "Under ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,500",
  "₹2,500+",
];

function EventCard({ event, onOpen }) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((value) => !value);
  };

  return (
    <article
      className="events-page-card"
      onClick={() => onOpen(event)}
    >
      <div className="events-page-image">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fallbackTried !== "category") {
              img.dataset.fallbackTried = "category";
              img.src = event.fallbackImage || universalFallbackImage;
            } else {
              img.onerror = null;
              img.src = universalFallbackImage;
            }
          }}
        />

        <span className="events-page-category">
          {event.category}
        </span>

        <button
          type="button"
          className={`events-page-heart ${
            liked ? "active" : ""
          }`}
          onClick={handleLike}
          aria-label={
            liked
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={16}
            fill={liked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="events-page-card-body">
        <h3>{event.title}</h3>

        <div className="events-page-meta">
          <span>
            <CalendarDays size={13} />
            {event.date}
          </span>

          <span>
            <MapPin size={13} />
            {event.city}
          </span>
        </div>

        <p className="events-page-venue">
          {event.venue}
        </p>

        <div className="events-page-card-bottom">
          <div>
            <small>Starting from</small>

            <strong>
              {"₹"}{Number(event.price).toLocaleString("en-IN")}
            </strong>
          </div>

          <button
            type="button"
            className="events-page-arrow"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(event);
            }}
            aria-label={`Open ${event.title}`}
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Events({ onBack, user, initialFilters = {} }) {
  const [activeCategory, setActiveCategory] =
    useState(initialFilters.category || "All Events");

  const [city, setCity] =
    useState(initialFilters.city || "");

  const [country, setCountry] =
    useState(initialFilters.country || "");

  const [search, setSearch] =
    useState(initialFilters.query || "");

  const [sort, setSort] =
    useState("Recommended");

  const [priceFilter, setPriceFilter] =
    useState("All Prices");

  const [selectedDate, setSelectedDate] =
    useState(initialFilters.date || "");

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch(
          "https://venuevista-o580.onrender.com/api/events?limit=100"
        );

        if (!response.ok) {
          throw new Error(`Events load nahi hue (HTTP ${response.status}).`);
        }

        const result = await response.json();

        // Support both a plain array and common paginated API response shapes.
        const apiEvents = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.events)
              ? result.data.events
              : Array.isArray(result.data?.items)
                ? result.data.items
                : Array.isArray(result.events)
                  ? result.events
                  : [];

        setEventsData(apiEvents.map(formatApiEvent));
      } catch (error) {
        setApiError(
          error.message ||
            "Backend se connection nahi ho paaya. Backend server check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let result = [...eventsData];

    // CATEGORY
    if (activeCategory !== "All Events") {
      result = result.filter(
        (event) =>
          event.category === activeCategory
      );
    }

    // CITY
    if (city.trim()) {
      const cityQuery = city.trim().toLocaleLowerCase();
      result = result.filter((event) =>
        String(event.city || "").toLocaleLowerCase().includes(cityQuery)
      );
    }

    // COUNTRY: open text supports any country, not just a fixed dropdown list.
    if (country.trim()) {
      const countryQuery = country.trim().toLocaleLowerCase();
      result = result.filter((event) =>
        [
          event.country,
          event.countryName,
          event.venueCountry,
          event.location,
          event.venue,
          event.city,
        ].filter(Boolean).join(" ").toLocaleLowerCase().includes(countryQuery)
      );
    }

    // SEARCH
    if (search.trim()) {
      const query = search
        .toLowerCase()
        .trim();

      result = result.filter((event) =>
        [
          event.title,
          event.category,
          event.city,
          event.venue,
          event.location,
          event.artist,
          Array.isArray(event.artists) ? event.artists.join(" ") : event.artists,
          event.organizer,
          event.description,
          event.country,
          event.countryName,
          event.tags,
          event.performer,
          event.team,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    // PRICE
    if (priceFilter === "Under ₹500") {
      result = result.filter(
        (event) => event.price < 500
      );
    }

    if (priceFilter === "₹500 – ₹1,000") {
      result = result.filter(
        (event) =>
          event.price >= 500 &&
          event.price <= 1000
      );
    }

    if (priceFilter === "₹1,000 – ₹2,500") {
      result = result.filter(
        (event) =>
          event.price >= 1000 &&
          event.price <= 2500
      );
    }

    if (priceFilter === "₹2,500+") {
      result = result.filter(
        (event) => event.price > 2500
      );
    }

    // DATE: compare API event dates using the local calendar date.
    if (selectedDate) {
      result = result.filter((event) => {
        const rawDate = event.startsAt || event.startDate || event.date;
        if (!rawDate) return false;
        const parsedDate = new Date(rawDate);
        if (Number.isNaN(parsedDate.getTime())) return false;
        const localDate = [
          parsedDate.getFullYear(),
          String(parsedDate.getMonth() + 1).padStart(2, "0"),
          String(parsedDate.getDate()).padStart(2, "0"),
        ].join("-");
        return localDate === selectedDate;
      });
    }

    // SORT
    if (sort === "Price: Low to High") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "Price: High to Low") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
   }, [
    eventsData,
    activeCategory,
    city,
    country,
    search,
    priceFilter,
    sort,
    selectedDate,
  ]);

  const clearFilters = () => {
    setActiveCategory("All Events");
    setCity("");
    setCountry("");
    setSearch("");
    setPriceFilter("All Prices");
    setSort("Recommended");
    setSelectedDate("");
  };

  /*
   =====================================================
   EVENT DETAILS
   =====================================================
  */

  if (selectedEvent) {
    return (
      <EventDetails
        event={selectedEvent}
        user={user}
        onBack={() =>
          setSelectedEvent(null)
        }
      />
    );
  }

  /*
   =====================================================
   EVENTS LIST
   =====================================================
  */

  return (
    <div className="events-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="events-page-header">

        <div className="events-page-header-inner">

          <div>
            <span className="events-page-eyebrow">
              DISCOVER EXPERIENCES
            </span>

            <h1>
              All Events
            </h1>

            <p>
              Find concerts, sports, theatre,
              comedy and unforgettable
              experiences.
            </p>
          </div>

          <button
            type="button"
            className="events-back-button"
            onClick={onBack}
          >
            ← Back to Home
          </button>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="events-page-search-wrap">

        <div className="events-page-search">

          <Search size={17} />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search events, artists, venues..."
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="clear-search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="events-page-content">

        <div className="events-page-layout">

          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside
            className={`events-filter ${
              filtersOpen ? "open" : ""
            }`}
          >

            <div className="filter-header">

              <div>

                <span>
                  FILTERS
                </span>

                <h3>
                  Find Your Event
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setFiltersOpen(false)
                }
                className="filter-close"
                aria-label="Close filters"
              >
                <X size={17} />
              </button>

            </div>

            {/* CATEGORY */}

            <div className="filter-block">

              <label>
                Category
              </label>

              <div className="filter-options">

                {categories.map(
                  (category) => (
                    <button
                      type="button"
                      key={category}
                      className={
                        activeCategory ===
                        category
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        setActiveCategory(
                          category
                        );

                        setFiltersOpen(
                          false
                        );
                      }}
                    >
                      <span>
                        {category}
                      </span>

                      {activeCategory ===
                        category && (
                        <span>
                          ✓
                        </span>
                      )}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* CITY */}

            <div className="filter-block">

              <label>
                City
              </label>

              <input
                type="search"
                value={city}
                placeholder="Any city worldwide"
                aria-label="Filter by any city"
                list="venuevista-events-city-suggestions"
                onChange={(e) => setCity(e.target.value)}
              />
              <datalist id="venuevista-events-city-suggestions">
                {["Delhi","Mumbai","Bengaluru","Pune","Hyderabad","Chennai","Kolkata","Jaipur","Ahmedabad","Lucknow","New York","Los Angeles","London","Paris","Tokyo","Dubai","Singapore","Toronto","Sydney","Melbourne","Berlin","Rome","Barcelona","Amsterdam","Bangkok","Seoul","Hong Kong","Cape Town","São Paulo","Auckland"].map((name) => <option key={name} value={name} />)}
              </datalist>

            </div>

            {/* COUNTRY */}

            <div className="filter-block">
              <label>Country</label>
              <input
                type="search"
                value={country}
                placeholder="Any country worldwide"
                aria-label="Filter by any country"
                list="venuevista-events-country-suggestions"
                onChange={(e) => setCountry(e.target.value)}
              />
              <datalist id="venuevista-events-country-suggestions">
                {["India","United States","United Kingdom","Canada","Australia","Japan","Singapore","United Arab Emirates","France","Germany","Italy","Spain","Brazil","South Korea","Thailand","Indonesia","Malaysia","New Zealand","South Africa","Saudi Arabia","Qatar","Netherlands","Switzerland","Ireland","Mexico"].map((name) => <option key={name} value={name} />)}
              </datalist>
            </div>

            {/* DATE */}

            <div className="filter-block">

              <label>
                Date
              </label>

              <label className="date-filter date-filter-control">
                <CalendarDays size={14} />
                <input
                  type="date"
                  aria-label="Filter events by date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                {selectedDate ? (
                  <button type="button" className="clear-date" onClick={() => setSelectedDate("")} aria-label="Clear date">×</button>
                ) : <ChevronDown size={13} />}
              </label>

            </div>

            {/* PRICE */}

            <div className="filter-block">

              <label>
                Price
              </label>

              <div className="price-options">

                {priceFilters.map(
                  (price) => (
                    <button
                      type="button"
                      key={price}
                      className={
                        priceFilter === price
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setPriceFilter(
                          price
                        )
                      }
                    >
                      {price}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* CLEAR */}

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>

          </aside>

          {/* =================================================
              RESULTS
          ================================================= */}

          <section className="events-results">

            <div className="events-results-top">

              <div>

                <span className="results-eyebrow">
                  SHOWING RESULTS
                </span>

                <h2>
                  {filteredEvents.length}{" "}
                  Events Found
                </h2>

              </div>

              <div className="results-controls">

                <button
                  type="button"
                  className="mobile-filter-button"
                  onClick={() =>
                    setFiltersOpen(true)
                  }
                >
                  <SlidersHorizontal
                    size={15}
                  />

                  Filters
                </button>

                <div className="sort-control">

                  <span>
                    Sort by
                  </span>

                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      Recommended
                    </option>

                    <option>
                      Price: Low to High
                    </option>

                    <option>
                      Price: High to Low
                    </option>
                  </select>

                </div>

              </div>

            </div>

            {/* =================================================
                EVENT GRID
            ================================================= */}

            {loading ? (
              <div className="events-empty">
                <p>Events load ho rahe hain...</p>
              </div>
            ) : apiError ? (
              <div className="events-empty">
                <h3>Events load nahi ho paaye</h3>
                <p>{apiError}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredEvents.length > 0 ? (

              <div className="events-page-grid">

                {filteredEvents.map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onOpen={
                        setSelectedEvent
                      }
                    />
                  )
                )}

              </div>

            ) : (

              <div className="events-empty">

                <Search size={30} />

                <h3>
                  No events found
                </h3>

                <p>
                  Try changing your search
                  or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}
