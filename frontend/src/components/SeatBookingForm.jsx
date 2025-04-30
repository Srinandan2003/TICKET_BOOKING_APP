import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const TrainSeatBooking = () => {
  // Simulate seat data (0 = available, 1 = booked)
  const generateSeats = () => {
    const seats = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        // Randomly set some seats as booked
        row.push(Math.random() > 0.85 ? 1 : 0);
      }
      seats.push(row);
    }
    return seats;
  };

  const [seatMap, setSeatMap] = useState(generateSeats());
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userBookings, setUserBookings] = useState([8, 9, 10, 11, 12]);

  // Count booked and available seats
  const bookedCount = seatMap.flat().filter(seat => seat === 1).length;
  const availableCount = seatMap.flat().length - bookedCount;

  const handleLogin = () => {
    if (username && password) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter both username and password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("userId");
    alert("You have been logged out.");
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');

  };

  const handleBooking = () => {
    // Simulate booking seats
    if (numberOfSeats <= 0 || numberOfSeats > 7) {
      alert('Please enter a valid number of seats (1-7)');
      return;
    }

    if (numberOfSeats > availableCount) {
      alert(`Sorry, only ${availableCount} seats are available.`);
      return;
    }

    alert(`Successfully booked ${numberOfSeats} seats!`);
    
    // For demo purposes, we'll just update some random seats
    const newSeatMap = [...seatMap];
    let booked = 0;
    
    // Find available seats and book them
    outer: for (let i = 0; i < newSeatMap.length; i++) {
      for (let j = 0; j < newSeatMap[i].length; j++) {
        if (newSeatMap[i][j] === 0) {
          newSeatMap[i][j] = 1;
          booked++;
          if (booked === parseInt(numberOfSeats)) break outer;
        }
      }
    }
    
    setSeatMap(newSeatMap);
  };

  const handleResetBookings = () => {
    setUserBookings([]);
    alert('All your bookings have been reset');
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

  if (!isLoggedIn) {
 
    const handleLogout = () => {
   
      navigate("/login");
    };
    handle
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Train Seat Booking</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4">
        {/* Seat Map Section */}
        <div className="md:w-2/3 bg-white shadow-sm rounded-lg p-6 mb-4 md:mb-0 md:mr-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Train Coach</h2>
          
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-2xl">
              <div className="grid grid-cols-10 gap-2">
                {seatMap.flat().map((seat, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-md flex items-center justify-center text-white font-medium ${
                      seat === 0 ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 mr-2 rounded"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="md:w-1/3 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
          
          <div className="mb-6">
            <div className="flex justify-between py-2 border-b">
              <span>Available Seats:</span>
              <span className="font-medium">{availableCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Booked Seats:</span>
              <span className="font-medium">{bookedCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Max Seats Selection:</span>
              <span className="font-medium">7</span>
            </div>
          </div>

          {userBookings.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Your Booked Seats:</h3>
              <div className="flex flex-wrap gap-2">
                {userBookings.map(seat => (
                  <div key={seat} className="bg-orange-500 text-white w-8 h-8 rounded-md flex items-center justify-center">
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="seatCount" className="block mb-2">Enter number of seats</label>
            <input
              id="seatCount"
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleBooking}
            className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 mb-3"
          >
            Book Seats
          </button>
          
          {userBookings.length > 0 && (
            <button
              onClick={handleResetBookings}
              className="w-full border border-red-500 text-red-500 p-3 rounded font-medium hover:bg-red-50"
            >
              Reset Bookings
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainSeatBooking;