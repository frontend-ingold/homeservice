import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  LockKeyhole,
  LogOut,
  MapPin,
  Phone,
  Search,
  Star,
  UserPlus,
  UserRound
} from "lucide-react";
import { services } from "./data/services";

const heroImages = [
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=80"
];

const serviceCities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "Austin, TX"
];

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    zip: ""
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: ""
  });
const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [bookingService, setBookingService] = useState(null);
  const [bookingDiscount, setBookingDiscount] = useState(null);
  const [serviceSearch, setServiceSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    notes: ""
  });
  const [bookingStatus, setBookingStatus] = useState({ type: "", message: "" });
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [searchError, setSearchError] = useState("");
  const isAuthOpen = authMode !== null;
  const isForgotPassword = authMode === "forgot";
  const isBookingOpen = bookingService !== null || bookingDiscount !== null;
  const isBookingsOpen = activeModal === "bookings";
  const isProfileOpen = activeModal === "profile";

  useEffect(() => {
    const savedUser = localStorage.getItem("homeserve_user");
    const savedBookings = localStorage.getItem("homeserve_bookings");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setProfileForm(parsedUser);
    }

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("homeserve_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("homeserve_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("homeserve_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    const slider = window.setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(slider);
  }, []);

  const openBooking = (service = services[0], address = "") => {
    if (!currentUser) {
      setAuthMode("register");
      setPageMessage("Please register or login before booking a service.");
      return;
    }

    setBookingService(service);
    setBookingDiscount(null);
    setBookingForm((current) => ({
      ...current,
      name: currentUser.name || current.name,
      phone: currentUser.phone || current.phone,
      email: currentUser.email || current.email,
      address: address || currentUser.address || current.address
    }));
    setBookingStatus({ type: "", message: "" });
  };

  const openDiscountBooking = () => {
    if (!currentUser) {
      setAuthMode("register");
      setPageMessage("Please register or login before claiming the discount.");
      return;
    }

    if (bookings.length > 0) {
      setPageMessage("Promo code FIRST20 is available only for your first booking.");
      return;
    }

    setBookingService(null);
    setBookingDiscount("FIRST20");
    setBookingStatus({ type: "", message: "" });
  };

  const selectDiscountService = (service) => {
    setBookingService(service);
    setBookingForm((current) => ({
      ...current,
      name: currentUser.name || current.name,
      phone: currentUser.phone || current.phone,
      email: currentUser.email || current.email,
      address: currentUser.address || current.address
    }));
  };

  const closeBooking = () => {
    setBookingService(null);
    setBookingDiscount(null);
    setBookingStatus({ type: "", message: "" });
    setIsBookingSubmitting(false);
  };

  const handleSearchBooking = (event) => {
    event.preventDefault();
    const normalizedSearch = serviceSearch.trim().toLowerCase();
    const normalizedLocation = locationSearch.trim().toLowerCase();
    const matchedService = services.find((service) => service.title.toLowerCase().includes(normalizedSearch));
    const matchedCity = serviceCities.find((city) => city.toLowerCase().includes(normalizedLocation));

    if (!normalizedSearch || !matchedService) {
      setSearchError("Please choose a valid service from the available service list.");
      return;
    }

    if (!normalizedLocation || !matchedCity) {
      setSearchError("Please choose a supported U.S. city from the city list.");
      return;
    }

    setSearchError("");
    setServiceSearch(matchedService.title);
    setLocationSearch(matchedCity);
    openBooking(matchedService, matchedCity);
  };

  const updateBookingField = (field, value) => {
    setBookingForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const updateAuthField = (field, value) => {
    setAuthForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const updateProfileField = (field, value) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const closeAuth = () => {
    setAuthMode(null);
    setAuthForm({
      name: "",
      email: "",
      password: "",
      zip: ""
    });
  };

  const submitAuth = (event) => {
    event.preventDefault();

    if (isForgotPassword) {
      setPageMessage("Password reset instructions have been sent to your email.");
      closeAuth();
      return;
    }

    const userName = authMode === "register" ? authForm.name : authForm.email.split("@")[0];
    const nextUser = {
      name: userName || "Customer",
      email: authForm.email,
      zip: authForm.zip,
      phone: "",
      address: ""
    };

    setCurrentUser(nextUser);
    setProfileForm(nextUser);
    setPageMessage(authMode === "register" ? "Registration successful. You can now book services." : "Login successful. You can now book services.");
    closeAuth();
  };

  const openProfile = () => {
    setProfileForm(currentUser);
    setActiveModal("profile");
  };

  const submitProfile = (event) => {
    event.preventDefault();
    setCurrentUser(profileForm);
    setPageMessage("Profile updated successfully.");
    setActiveModal(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setBookings([]);
    localStorage.removeItem("homeserve_user");
    localStorage.removeItem("homeserve_bookings");
    setPageMessage("You have been logged out.");
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setIsBookingSubmitting(true);
    setBookingStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...bookingForm,
          serviceId: bookingService.id,
          discountCode: bookingDiscount || ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed. Please check your details.");
      }

      setBookingStatus({
        type: "success",
        message: `${data.message}. Your booking ID is ${data.booking.id}.`
      });
      const savedBooking = {
        ...data.booking,
        status: "Pending",
        discountCode: bookingDiscount || "",
        discountLabel: bookingDiscount === "FIRST20" ? "20% off first booking" : ""
      };

      setBookings((current) => [savedBooking, ...current]);
      setPageMessage(`Booking successful. Your booking ID is ${data.booking.id}.`);
      setBookingForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        address: "",
        date: "",
        notes: ""
      });
      closeBooking();
      setActiveModal("bookings");
    } catch (error) {
      setBookingStatus({
        type: "error",
        message: error.message
      });
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const startEditBooking = (booking) => {
    setEditingBooking({
      id: booking.id,
      address: booking.address,
      date: booking.date === "Flexible" ? "" : booking.date,
      notes: booking.notes || ""
    });
  };

  const updateEditingBooking = (field, value) => {
    setEditingBooking((current) => ({
      ...current,
      [field]: value
    }));
  };

  const saveEditedBooking = (event) => {
    event.preventDefault();
    setBookings((current) =>
      current.map((booking) =>
        booking.id === editingBooking.id
          ? {
              ...booking,
              address: editingBooking.address,
              date: editingBooking.date || "Flexible",
              notes: editingBooking.notes
            }
          : booking
      )
    );
    setEditingBooking(null);
    setPageMessage("Booking updated successfully.");
  };

  const openCancelBooking = (booking) => {
    setCancelBooking(booking);
    setCancelReason("");
  };

  const confirmCancelBooking = (event) => {
    event.preventDefault();
    setBookings((current) =>
      current.map((booking) =>
        booking.id === cancelBooking.id
          ? {
              ...booking,
              status: "Cancelled",
              cancelReason
            }
          : booking
      )
    );
    setCancelBooking(null);
    setCancelReason("");
    setPageMessage("Booking cancelled successfully.");
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="HomeServe Pro home">
          <span className="brand-mark">H</span>
          <span>HomeServe Pro</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#feedback">Feedback</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <>
              <button className="auth-link" type="button" onClick={() => setActiveModal("bookings")}>
                <ClipboardList size={17} />
                <span>My Bookings</span>
              </button>
              <button className="auth-link" type="button" onClick={openProfile}>
                <UserRound size={17} />
                <span>Edit Profile</span>
              </button>
              <button className="register-link" type="button" onClick={logout}>
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button className="auth-link" type="button" onClick={() => setAuthMode("login")}>
                <LockKeyhole size={17} />
                <span>Login</span>
              </button>
              <button className="register-link" type="button" onClick={() => setAuthMode("register")}>
                <UserPlus size={17} />
                <span>Register</span>
              </button>
            </>
          )}
          <a className="header-call" href="tel:+12125550148">
            <Phone size={18} />
            <span>Call Now</span>
          </a>
        </div>
      </header>

      {pageMessage && (
        <div className="page-message" role="status">
          <span>{pageMessage}</span>
          <button type="button" onClick={() => setPageMessage("")}>x</button>
        </div>
      )}

      <main id="top">
        <section className="hero">
          {heroImages.map((image, index) => (
            <div
              className={`hero-slide ${index === heroImageIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${image})` }}
              aria-hidden="true"
              key={image}
            />
          ))}
          <div className="hero-content">
            <p className="eyebrow">Trusted local home services</p>
            <h1>Book skilled workers for every home repair.</h1>
            <p className="hero-copy">
              Find reliable carpenters, plumbers, painters, electricians, cleaners, and more across major U.S. cities with quick scheduling and clear pricing.
            </p>

            <form className="search-panel" onSubmit={handleSearchBooking}>
              <label>
                <span>What service do you need?</span>
                <div className="input-shell">
                  <Search size={19} />
                  <input
                    type="search"
                    placeholder="Search carpenter, plumber, painter..."
                    list="service-options"
                    value={serviceSearch}
                    onChange={(event) => setServiceSearch(event.target.value)}
                  />
                  <datalist id="service-options">
                    {services.map((service) => (
                      <option value={service.title} key={service.id} />
                    ))}
                  </datalist>
                </div>
              </label>
              <label>
                <span>Your location</span>
                <div className="input-shell">
                  <MapPin size={19} />
                  <input
                    type="text"
                    placeholder="New York, Los Angeles, Chicago..."
                    list="city-options"
                    value={locationSearch}
                    onChange={(event) => setLocationSearch(event.target.value)}
                  />
                  <datalist id="city-options">
                    {serviceCities.map((city) => (
                      <option value={city} key={city} />
                    ))}
                  </datalist>
                </div>
              </label>
              <button type="submit">
                Book Service
                <ArrowRight size={18} />
              </button>
            </form>
            {searchError && <p className="search-error">{searchError}</p>}

            <div className="hero-stats" aria-label="Service highlights">
              <span><Star size={18} /> 4.8 rated</span>
              <span><CheckCircle2 size={18} /> Verified experts</span>
              <span><Clock3 size={18} /> Fast arrival</span>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading">
            <p className="eyebrow">10 core services</p>
            <h2>Choose what your home needs today.</h2>
          </div>

          <div className="services-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.id}>
                  <div className="service-photo">
                    <img src={service.image} alt={`${service.title} service`} loading="lazy" />
                    <div className="service-icon">
                      <Icon size={25} />
                    </div>
                  </div>
                  <div className="service-body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="service-meta">
                      <span>{service.price}</span>
                      <span>{service.time}</span>
                    </div>
                    <button type="button" onClick={() => openBooking(service)}>
                      Select
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="discount-section" aria-label="Limited time discount">
          <div className="discount-content">
            <p className="eyebrow">Limited time offer</p>
            <h2>Get 20% off your first home service booking.</h2>
            <p>
              New customers can use code <strong>FIRST20</strong> on plumbing, cleaning, painting, electrical, and repair services in supported U.S. cities.
            </p>
            <button type="button" onClick={openDiscountBooking}>
              Claim Discount
              <ArrowRight size={17} />
            </button>
          </div>
          <div className="discount-ad">
            <span>FIRST20</span>
            <strong>20% OFF</strong>
            <p>First booking only</p>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="about-media">
            <img
              src="https://images.unsplash.com/photo-1581092919535-7146ff1a590b?auto=format&fit=crop&w=1200&q=80"
              alt="Home service professionals preparing tools"
            />
          </div>
          <div className="about-content">
            <p className="eyebrow">About us</p>
            <h2>Reliable service professionals for busy homes.</h2>
            <p>
              HomeServe Pro connects U.S. homeowners with skilled local workers for repairs, cleaning, maintenance, and moving support. Every booking is handled with clear communication, verified service partners, and practical pricing.
            </p>
            <div className="about-points">
              <span><CheckCircle2 size={18} /> Verified technicians</span>
              <span><CheckCircle2 size={18} /> Transparent service rates</span>
              <span><CheckCircle2 size={18} /> Support from booking to completion</span>
            </div>
          </div>
        </section>

        <section className="section feedback-section" id="feedback">
          <div className="section-heading">
            <p className="eyebrow">Customer feedback</p>
            <h2>What customers say after the job is done.</h2>
          </div>

          <div className="feedback-grid">
            <article className="feedback-card">
              <div className="feedback-person">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" alt="Customer Priya Sen" />
                <div>
                  <h3>Priya Sen</h3>
                  <p>New York, NY</p>
                </div>
              </div>
              <div className="rating" aria-label="5 star rating">
                <Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} />
              </div>
              <p>The plumber arrived on time, fixed the leak cleanly, and explained the cost before starting. Very smooth experience.</p>
            </article>

            <article className="feedback-card">
              <div className="feedback-person">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Customer Arjun Mehta" />
                <div>
                  <h3>Arjun Mehta</h3>
                  <p>Austin, TX</p>
                </div>
              </div>
              <div className="rating" aria-label="5 star rating">
                <Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} />
              </div>
              <p>I booked painting and electrical work together. The team coordinated well and finished exactly within the promised time.</p>
            </article>

            <article className="feedback-card">
              <div className="feedback-person">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" alt="Customer Neha Roy" />
                <div>
                  <h3>Neha Roy</h3>
                  <p>San Diego, CA</p>
                </div>
              </div>
              <div className="rating" aria-label="5 star rating">
                <Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} />
              </div>
              <p>The deep cleaning service made the kitchen and bathrooms look fresh again. Booking was easy and support was responsive.</p>
            </article>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="section-heading">
            <p className="eyebrow">Simple booking</p>
            <h2>How it works</h2>
          </div>

          <div className="process-grid">
            <div>
              <span>01</span>
              <h3>Pick a service</h3>
              <p>Select the repair or maintenance work you need from the service list.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Share details</h3>
              <p>Add your address, preferred time, and any notes for the technician.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Get it done</h3>
              <p>A verified professional arrives, completes the job, and confirms the final price.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div>
          <h2>Need urgent help at home?</h2>
          <p>Serving New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, and Austin.</p>
        </div>
        <a href="tel:+12125550148">
          <Phone size={19} />
          +1 (212) 555-0148
        </a>
      </footer>

      {isBookingOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeBooking}>
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close booking popup" onClick={closeBooking}>
              x
            </button>
            <p className="eyebrow">{bookingDiscount ? "Discount booking" : "Book service"}</p>
            <h2 id="booking-title">{bookingService ? bookingService.title : "Choose a service"}</h2>
            <p className="booking-intro">
              {bookingService ? `${bookingService.price} - ${bookingService.time}` : "Select the service you want to book with promo code FIRST20."}
            </p>

            {bookingDiscount && (
              <div className="discount-applied">
                Promo code <strong>{bookingDiscount}</strong> applied: 20% off first booking.
              </div>
            )}

            {!bookingService && (
              <div className="service-picker">
                {services.map((service) => (
                  <button type="button" onClick={() => selectDiscountService(service)} key={service.id}>
                    {service.title}
                    <span>{service.price}</span>
                  </button>
                ))}
              </div>
            )}

            {bookingService && (
            <form className="booking-form" onSubmit={submitBooking}>
              <div className="form-row">
                <label>
                  Full name
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={bookingForm.name}
                    onChange={(event) => updateBookingField("name", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    placeholder="(212) 555-0198"
                    value={bookingForm.phone}
                    onChange={(event) => updateBookingField("phone", event.target.value)}
                    required
                  />
                </label>
              </div>

              <label>
                Email address
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={bookingForm.email}
                  onChange={(event) => updateBookingField("email", event.target.value)}
                />
              </label>

              <label>
                Service address
                <input
                  type="text"
                  placeholder="123 Main St, New York, NY 10001"
                  value={bookingForm.address}
                  onChange={(event) => updateBookingField("address", event.target.value)}
                  required
                />
              </label>

              <label>
                Preferred date
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(event) => updateBookingField("date", event.target.value)}
                />
              </label>

              <label>
                Job notes
                <textarea
                  placeholder="Describe the work needed..."
                  value={bookingForm.notes}
                  onChange={(event) => updateBookingField("notes", event.target.value)}
                />
              </label>

              {bookingStatus.message && (
                <p className={`booking-status ${bookingStatus.type}`}>{bookingStatus.message}</p>
              )}

              <button type="submit" disabled={isBookingSubmitting}>
                {isBookingSubmitting ? "Sending..." : "Confirm Booking"}
                <ArrowRight size={17} />
              </button>
            </form>
            )}
          </div>
        </div>
      )}

      {isBookingsOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveModal(null)}>
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="my-bookings-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close my bookings popup" onClick={() => setActiveModal(null)}>
              x
            </button>
            <p className="eyebrow">My bookings</p>
            <h2 id="my-bookings-title">Your service bookings</h2>
            {bookings.length === 0 ? (
              <p className="empty-state">No bookings yet. Select a service to create your first booking.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <article className="booking-item" key={booking.id}>
                    <div>
                      <div className="booking-title-row">
                        <h3>{booking.service.title}</h3>
                        <span className={`status-pill ${booking.status === "Cancelled" ? "cancelled" : ""}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p>{booking.address}</p>
                      <p>{booking.date} - {booking.service.price}</p>
                      {booking.discountCode && (
                        <p className="promo-line">
                          Promo: {booking.discountCode} ({booking.discountLabel || "Discount applied"})
                        </p>
                      )}
                      {booking.notes && <p>Notes: {booking.notes}</p>}
                      {booking.cancelReason && <p className="cancel-reason">Cancel reason: {booking.cancelReason}</p>}
                    </div>
                    <div className="booking-actions">
                      <span>#{booking.id}</span>
                      <button type="button" onClick={() => startEditBooking(booking)} disabled={booking.status === "Cancelled"}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => openCancelBooking(booking)} disabled={booking.status === "Cancelled"}>
                        Cancel
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {editingBooking && (
              <form className="booking-form inline-form" onSubmit={saveEditedBooking}>
                <h3>Edit booking</h3>
                <label>
                  Service address
                  <input
                    type="text"
                    value={editingBooking.address}
                    onChange={(event) => updateEditingBooking("address", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Preferred date
                  <input
                    type="date"
                    value={editingBooking.date}
                    onChange={(event) => updateEditingBooking("date", event.target.value)}
                  />
                </label>
                <label>
                  Job notes
                  <textarea
                    value={editingBooking.notes}
                    onChange={(event) => updateEditingBooking("notes", event.target.value)}
                  />
                </label>
                <div className="form-actions">
                  <button type="submit">Save Changes</button>
                  <button type="button" className="secondary" onClick={() => setEditingBooking(null)}>Close</button>
                </div>
              </form>
            )}

            {cancelBooking && (
              <form className="booking-form inline-form" onSubmit={confirmCancelBooking}>
                <h3>Cancel {cancelBooking.service.title}</h3>
                <label>
                  Cancellation reason
                  <textarea
                    placeholder="Tell us why you are cancelling..."
                    value={cancelReason}
                    onChange={(event) => setCancelReason(event.target.value)}
                    required
                  />
                </label>
                <div className="form-actions">
                  <button type="submit">Confirm Cancel</button>
                  <button type="button" className="secondary" onClick={() => setCancelBooking(null)}>Close</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveModal(null)}>
          <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close profile popup" onClick={() => setActiveModal(null)}>
              x
            </button>
            <p className="eyebrow">Edit profile</p>
            <h2 id="profile-title">Update your details</h2>
            <form className="auth-form" onSubmit={submitProfile}>
              <label>
                Full name
                <input type="text" value={profileForm.name} onChange={(event) => updateProfileField("name", event.target.value)} required />
              </label>
              <label>
                Email address
                <input type="email" value={profileForm.email} onChange={(event) => updateProfileField("email", event.target.value)} required />
              </label>
              <label>
                Phone
                <input type="tel" value={profileForm.phone} onChange={(event) => updateProfileField("phone", event.target.value)} placeholder="(212) 555-0198" />
              </label>
              <label>
                Default service address
                <input type="text" value={profileForm.address} onChange={(event) => updateProfileField("address", event.target.value)} placeholder="123 Main St, New York, NY 10001" />
              </label>
              <label>
                ZIP code
                <input type="text" value={profileForm.zip} onChange={(event) => updateProfileField("zip", event.target.value)} placeholder="10001" />
              </label>
              <button type="submit">
                Save Profile
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>
      )}

      {isAuthOpen && (
        <div className="modal-backdrop" role="presentation" onClick={closeAuth}>
          <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close account popup" onClick={closeAuth}>
              x
            </button>
            <p className="eyebrow">Customer account</p>
            <h2 id="auth-title">
              {authMode === "login" && "Login to your account"}
              {authMode === "register" && "Create your account"}
              {isForgotPassword && "Reset your password"}
            </h2>
            <p>
              {isForgotPassword
                ? "Enter your email address and we will send password reset instructions."
                : "Manage bookings, saved U.S. service addresses, visit schedules, and estimates."}
            </p>

            {!isForgotPassword && (
              <div className="account-tabs" aria-label="Account options">
                <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Login</button>
                <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>Register</button>
              </div>
            )}

            <form className="auth-form" onSubmit={submitAuth}>
              {authMode === "register" && (
                <label>
                  Full name
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={authForm.name}
                    onChange={(event) => updateAuthField("name", event.target.value)}
                    required
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={authForm.email}
                  onChange={(event) => updateAuthField("email", event.target.value)}
                  required
                />
              </label>
              {!isForgotPassword && (
                <label>
                  Password
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={authForm.password}
                    onChange={(event) => updateAuthField("password", event.target.value)}
                    required
                  />
                </label>
              )}
              {authMode === "register" && (
                <label>
                  Service ZIP code
                  <input
                    type="text"
                    placeholder="10001"
                    value={authForm.zip}
                    onChange={(event) => updateAuthField("zip", event.target.value)}
                    required
                  />
                </label>
              )}
              <button type="submit">
                {authMode === "login" && "Login"}
                {authMode === "register" && "Register"}
                {isForgotPassword && "Send reset link"}
                <ArrowRight size={17} />
              </button>
              {authMode === "login" && (
                <button className="forgot-link" type="button" onClick={() => setAuthMode("forgot")}>
                  Forgot password?
                </button>
              )}
              {isForgotPassword && (
                <button className="forgot-link" type="button" onClick={() => setAuthMode("login")}>
                  Back to login
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
