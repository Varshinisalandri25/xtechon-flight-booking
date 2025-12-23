import { useEffect, useState } from "react";
import axios from "axios";
import "./Flights.css";

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState({}); // UI only

  // 🔐 Route protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
  }, []);

  // ✈️ Fetch flights
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/flights")
      .then((res) => setFlights(res.data))
      .catch(() => alert("Failed to load flights"));
  }, []);

  // 💰 Wallet
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWalletBalance(res.data.balance))
      .catch(() => alert("Failed to load wallet"));
  }, []);

  // 📦 Book flight (UNCHANGED)
  const bookFlight = async (flightId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/book",
        { flightId, seats: 1 }, // 🔒 NOT CHANGED
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWalletBalance(res.data.remainingBalance);

      document.body.classList.add("landing");
      setTimeout(() => {
        document.body.classList.remove("landing");
        alert("🛬 Flight booked successfully!\n✨ Happy & safe journey!");
      }, 1200);
    } catch (e) {
      alert(e.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div className="flights-container">

      {/* 🌤️ SKY */}
      <div className="sky">
        <span className="plane p1">✈️</span>
        <span className="plane p2">✈️</span>
        <span className="plane p3">✈️</span>
        <span className="plane p4">✈️</span>

        <span className="cloud c1">☁️</span>
        <span className="cloud c2">☁️</span>
        <span className="cloud c3">☁️</span>
        <span className="cloud c4">☁️</span>
        <span className="cloud c5">☁️</span>
        <span className="cloud c6">☁️</span>
      </div>

      {/* NAV */}
      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <button
        className="logout-corner"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>

      {/* TITLE */}
      <h2 className="flights-title">Available Flights</h2>

      <div className="journey-quote">
        ✨ Safe skies. Smooth landings. Unforgettable journeys ✨
      </div>

      <div className="wallet-center">
        💰 Wallet ₹{walletBalance}
      </div>

      {/* FLIGHTS */}
      <div className="flights-list">
        {flights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <h4 className="airline-name">{flight.airline}</h4>

            <p className="route">
              {flight.source} ✈ {flight.destination}
            </p>

            {/* 🕒 UI ONLY (no backend dependency) */}
            <p className="details">
              🗓 Departure: Tomorrow • ⏰ 10:30 AM
            </p>

            {/* 💺 Seat selector (UI only) */}
            <div className="seat-ui">
              💺 Seat:
              <select
                value={selectedSeats[flight.id] || "A1"}
                onChange={(e) =>
                  setSelectedSeats({
                    ...selectedSeats,
                    [flight.id]: e.target.value,
                  })
                }
              >
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
              </select>
            </div>

            <p className="price">₹ {flight.currentPrice}</p>

            <button
              className="takeoff-btn"
              onClick={() => bookFlight(flight.id)}
            >
              ✈ Take Off
            </button>
          </div>
        ))}
      </div>

      {/* MY BOOKINGS */}
      <div className="mybookings-bottom">
        <button
          className="nav-btn"
          onClick={() => (window.location.href = "/my-bookings")}
        >
          My Bookings
        </button>
      </div>
    </div>
  );
}
