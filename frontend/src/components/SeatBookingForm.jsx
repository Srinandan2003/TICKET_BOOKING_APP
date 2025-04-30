import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';

const SeatBooking = () => {
  const [seatMap, setSeatMap] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeatStatus();
  }, []);

  const fetchSeatStatus = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axiosInstance.get('/api/seat/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSeatMap(response.data);
      setLoading(false);
    } catch (error) {
      alert('Error fetching seats: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axiosInstance.post('/api/seat/book', 
        { count: parseInt(numberOfSeats) },
        { headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert(response.data.message);
      setSeatMap(response.data.fullSeats);
    } catch (error) {
      alert('Error booking seats: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axiosInstance.post(
        '/api/seat/reset-bookings',
        {}, // empty body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      alert(response.data.message);
      fetchSeatStatus(); // Refresh seat map after reset
    } catch (error) {
      alert('Error resetting seats: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("userId");
    alert("You have been logged out.");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setNumberOfSeats("");
      return;
    }
    
    const num = parseInt(value);
    if (!isNaN(num)) {
      const clamped = Math.min(7, Math.max(1, num));
      setNumberOfSeats(clamped);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col p-6">
      {/* Logout Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row max-w-5xl w-full mx-auto gap-6">
        {/* Seat Map */}
        <div className="md:w-2/3 w-full p-6 bg-white rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🎟️ Ticket Booking</h1>
          {loading ? (
            <p className="text-center text-gray-500">Loading seats...</p>
          ) : (
            <SeatMap seats={seatMap} />
          )}
        </div>

        {/* Booking Form */}
        <div className="md:w-1/3 w-full p-6 flex flex-col justify-center items-center bg-white rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Book Your Seats</h2>
          <div className="w-full max-w-xs mb-6">
            <input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={handleInputChange}
              placeholder="Enter number of seats"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <button
            onClick={handleBooking}
            disabled={numberOfSeats < 1 || numberOfSeats > 7 || loading}
            className="w-full max-w-xs bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </button>
          <button
            onClick={handleReset}
            className="w-full max-w-xs mt-4 bg-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            Reset Booking
          </button>
        </div>
      </div>
    </div>
  );
};

const SeatMap = ({ seats }) => {
  let seatNumber = 1;
  const bookedCount = seats.flat().filter(seat => seat === 1).length;
  const availableCount = seats.flat().length - bookedCount;

  return (
    <div>
      <div className="grid grid-cols-7 gap-3">
        {seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-110 ${
                seat === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
              } ${rowIndex === 11 ? 'col-span-2' : ''}`}
            >
              {seatNumber++}
            </div>
          ))
        )}
      </div>
      <div className="mt-6 flex justify-center space-x-6">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500 text-white shadow-md">
          Booked: {bookedCount}
        </span>
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500 text-white shadow-md">
          Available: {availableCount}
        </span>
      </div>
    </div>
  );
};

export default SeatBooking;