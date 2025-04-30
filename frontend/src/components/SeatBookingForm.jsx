import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SeatBooking = () => {
  const [seatMap, setSeatMap] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeatStatus();
  }, []);

  const fetchSeatStatus = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axiosInstance.get('/api/seat/status', { headers: { 'Authorization': `Bearer ${token}` } });
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
      const response = await axiosInstance.post('/api/seat/book', { count: parseInt(numberOfSeats) }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
      toast.success(response.data.message);
      setSeatMap(response.data.fullSeats);
      let booked = [];
      let seatNumber = 1;
      for (let row of response.data.fullSeats) for (let seat of row) if (seat === 1) booked.push(seatNumber++);
      setBookedSeats(booked);
    } catch (error) {
      toast.error('Error booking seats: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axiosInstance.post('/api/seat/reset-bookings', {}, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
      toast.success(response.data.message);
      setBookedSeats([]);
      fetchSeatStatus();
    } catch (error) {
      toast.error('Error resetting seats: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("userId");
    toast.success("Logged out.");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "") setNumberOfSeats("");
    else {
      const num = parseInt(value);
      if (!isNaN(num)) setNumberOfSeats(Math.min(7, Math.max(1, num)));
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col overflow-hidden">
      <nav className="bg-blue-600 text-white p-2 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">🎟️ Ticket Booking</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-full shadow-md hover:bg-red-600 transition-all duration-200 hover:scale-105 text-sm">Logout</button>
      </nav>
      <div className="flex flex-row flex-1 w-full h-[calc(100vh-56px)]">
        <div className="w-2/3 h-full p-2 bg-white flex flex-col">
          {loading ? <p className="text-center text-gray-500 text-base">Loading...</p> : <SeatMap seats={seatMap} />}
        </div>
        <div className="w-1/3 h-full p-2 flex flex-col bg-white">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Booking Info</h2>
          <div className="space-y-1 mb-2">
            <p className="text-sm text-gray-700">Available: {seatMap.length ? seatMap.flat().length - seatMap.flat().filter(seat => seat === 1).length : 0}</p>
            <p className="text-sm text-gray-700">Max Selection: 7</p>
            <div>
              <p className="text-sm text-gray-700">Booked:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {bookedSeats.length > 0 ? bookedSeats.map(seat => (
                  <span key={seat} className="px-2 py-1 rounded-full bg-orange-500 text-white text-xs">{seat}</span>
                )) : <p className="text-xs text-gray-500">None</p>}
              </div>
            </div>
          </div>
          <input
            type="number"
            min="1"
            max="7"
            value={numberOfSeats}
            onChange={handleInputChange}
            placeholder="Seats"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleBooking}
            disabled={numberOfSeats < 1 || numberOfSeats > 7 || loading}
            className="w-full mt-2 bg-blue-600 text-white p-2 rounded shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 text-sm"
          >
            Book
          </button>
          <button
            onClick={handleReset}
            className="w-full mt-1 bg-red-500 text-white p-2 rounded shadow-md hover:bg-red-600 transition-all duration-200 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

const SeatMap = ({ seats }) => {
  let seatNumber = 1;
  const seatHeight = `calc((100vh - 56px - 16px) / 12 - 4px)`; // 56px navbar, 16px padding, 12 rows, 4px gap
  const seatWidth = `calc((100vw * 2 / 3 - 16px) / 7 - 4px)`; // 2/3 width, 16px padding, 7 columns, 4px gap

  return (
    <div className="flex flex-row h-full">
      <div className="grid grid-cols-7 gap-1 flex-1">
        {seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rounded flex items-center justify-center text-white font-semibold shadow transition-all duration-200 hover:scale-105 ${
                seat === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'
              } ${rowIndex === 11 ? 'col-span-2' : ''}`}
              style={{ width: seatWidth, height: seatHeight }}
            >
              <span className="text-xs md:text-sm">{seatNumber++}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SeatBooking;