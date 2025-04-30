import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error('Error fetching seats: ' + (error.response?.data?.message || error.message));
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
      toast.success(response.data.message);
      setSeatMap(response.data.fullSeats);
    } catch (error) {
      toast.error('Error booking seats: ' + (error.response?.data?.message || error.message));
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
  
      toast.success(response.data.message);
      fetchSeatStatus(); // Refresh seat map after reset
    } catch (error) {
      toast.error('Error resetting seats: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("userId");
    toast.success("You have been logged out.");
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
    <div className="h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-3 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">🎟️ Ticket Booking</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-row flex-1 w-full h-[calc(100vh-64px)]">
        {/* Seat Map */}
        <div className="w-2/3 h-full p-4 bg-white flex flex-col">
          {loading ? (
            <p className="text-center text-gray-500 text-xl">Loading seats...</p>
          ) : (
            <SeatMap seats={seatMap} />
          )}
        </div>

        {/* Booking Form */}
        <div className="w-1/3 h-full p-4 flex flex-col justify-center items-center bg-white">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Book Your Seats</h2>
          <div className="w-full mb-6">
            <input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={handleInputChange}
              placeholder="Enter number of seats"
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
            />
          </div>
          <button
            onClick={handleBooking}
            disabled={numberOfSeats < 1 || numberOfSeats > 7 || loading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Book Now
          </button>
          <button
            onClick={handleReset}
            className="w-full mt-4 bg-gray-600 text-white p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Reset Booking
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const SeatMap = ({ seats }) => {
  let seatNumber = 1;
  const bookedCount = seats.flat().filter(seat => seat === 1).length;
  const availableCount = seats.flat().length - bookedCount;

  // Calculate seat size based on height to fit all rows (12 rows + status bar space)
  const seatHeight = `calc((100vh - 64px - 32px - 60px) / 12 - 8px)`; // 64px navbar, 32px padding, 60px status bar, 12 rows, 8px gap
  const seatWidth = `calc((100vw * 2 / 3 - 32px) / 7 - 8px)`; // 2/3 width, 32px padding, 7 columns, 8px gap

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 gap-2 flex-1">
        {seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rounded-lg flex items-center justify-center text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-110 ${
                seat === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
              } ${rowIndex === 11 ? 'col-span-2' : ''}`}
              style={{ width: seatWidth, height: seatHeight }}
            >
              <span className="text-sm md:text-lg">{seatNumber++}</span>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-center space-x-6 h-[60px] items-center">
        <span className="inline-flex items-center px-5 py-3 rounded-full bg-yellow-500 text-white shadow-md text-lg">
          Booked: {bookedCount}
        </span>
        <span className="inline-flex items-center px-5 py-3 rounded-full bg-green-500 text-white shadow-md text-lg">
          Available: {availableCount}
        </span>
      </div>
    </div>
  );
};

export default SeatBooking;