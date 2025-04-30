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
    <div className="min-h-screen bg-gray-200 flex flex-col p-6">
      {/* Logout Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row max-w-4xl w-full mx-auto">
        {/* Seat Map */}
        <div className="md:w-2/3 w-full p-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Ticket Booking</h1>
          {loading ? (
            <p className="text-center">Loading seats...</p>
          ) : (
            <SeatMap seats={seatMap} />
          )}
        </div>

        {/* Booking Form */}
        <div className="md:w-1/3 w-full p-4 flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-4">Book Seats</h2>
          <div className="w-full max-w-xs mb-4">
            <input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={handleInputChange}
              placeholder="Enter number of seats"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleBooking}
            disabled={numberOfSeats < 1 || numberOfSeats > 7 || loading}
            className="w-full max-w-xs bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Book
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
      <div className="grid grid-cols-7 gap-2">
        {seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 h-10 rounded flex items-center justify-center text-white font-semibold ${
                seat === 0 ? 'bg-green-500' : 'bg-yellow-500'
              } ${rowIndex === 11 ? 'col-span-2' : ''}`}
            >
              {seatNumber++}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <span className="inline-flex items-center px-3 py-1 rounded bg-yellow-500 text-white">
          Booked: {bookedCount}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded bg-green-500 text-white">
          Available: {availableCount}
        </span>
      </div>
    </div>
  );
};

export default SeatBooking;