import { useEffect, useState } from "react";
import axios from "axios";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  // 🔐 Route protection + fetch bookings
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:5000/api/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBookings(res.data))
      .catch(() => alert("Failed to load bookings"));
  }, []);

  // ❌ Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/book/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert("Booking cancelled & amount refunded");
    } catch (err) {
      alert("Cancel failed");
    }
  };

  // 🎫 DOWNLOAD TICKET (FIXED – TOKEN INCLUDED)
  const downloadTicket = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/api/ticket/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ticket-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download ticket");
      console.error(err);
    }
  };

  return (
    <div className="mybookings-container">
      <h2 className="mybookings-title">✨ Your Journey History</h2>

      <button className="back-btn" onClick={() => window.history.back()}>
        ← Back
      </button>

      <p className="mybookings-subtitle">
        Your comfort and safety are always our priority.
      </p>

      <div className="journey-quote">
        ✈️ Wishing you a <span>happy & safe journey</span>.  
        Sit back, relax, and enjoy the skies.
      </div>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className="mybookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <h4 className="airline-name">
                {b.Flight.airline}
              </h4>

              <p className="route">
                {b.Flight.source} ✈ {b.Flight.destination}
              </p>

              <p className="details">
                Seats: {b.seats} • Paid: ₹{b.pricePaid}
              </p>

              {/* ✅ PNR */}
              <p className="pnr">
                🎫 <strong>PNR:</strong> {b.pnr}
              </p>

              {/* ✅ DOWNLOAD TICKET */}
              <button
                className="download-btn"
                onClick={() => downloadTicket(b.id)}
              >
                🎫 Download Ticket
              </button>

              <button
                className="cancel-btn"
                onClick={() => cancelBooking(b.id)}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
