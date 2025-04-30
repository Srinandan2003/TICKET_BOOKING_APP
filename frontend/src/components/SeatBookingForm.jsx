import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Chair, Film, RotateCw, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axiosInstance.js';

const SeatBooking = () => {
  const [seatMap, setSeatMap] = useState<number[][]>([]);
  const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeatStatus();
  }, []);

  const fetchSeatStatus = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.get('/api/seat/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSeatMap(response.data);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.post('/api/seat/book',
        { count: parseInt(numberOfSeats) },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.data.message) {
        toast.success(response.data.message);
      }
      setSeatMap(response.data.fullSeats);
      setError(null);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to book seats.';
        setError(errorMessage);
        toast.error(errorMessage);
    }
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosInstance.post(
        '/api/seat/reset-bookings',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success(response.data.message);
      fetchSeatStatus();
      setError(null);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to reset bookings.';
        setError(errorMessage);
        toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("userId");
    toast.info("You have been logged out.");
    navigate("/login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setNumberOfSeats(0);
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num)) {
      const clamped = Math.min(7, Math.max(1, num));
      setNumberOfSeats(clamped);
    }
  };

    const getSeatClassNames = (...classes: string[]) => {
        return classes.filter(Boolean).join(' ');
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      <ToastContainer />
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6" />
          <h1 className="text-2xl font-bold">CineBook</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 max-w-7xl w-full mx-auto gap-8 p-6">
        {/* Seat Map */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Chair className="w-5 h-5" />
              Seat Selection
            </h2>
          </div>
          <div className="p-6 flex-1 overflow-auto">
            {loading ? (
              <div className="text-center text-gray-500 text-xl flex items-center justify-center h-full">
                Loading seats...
              </div>
            ) : (
              <SeatMap seats={seatMap} />
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="w-full md:w-1/3 bg-white rounded-xl shadow-xl p-6 flex flex-col justify-start items-center">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Book Your Seats</h2>
          <div className="w-full max-w-sm mb-8">
            <input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={handleInputChange}
              placeholder="Enter number of seats (1-7)"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
            />
          </div>
          <button
            onClick={handleBooking}
            disabled={numberOfSeats < 1 || numberOfSeats > 7 || loading}
            className={getSeatClassNames(
                "w-full max-w-sm bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700",
                "disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105",
                "text-lg flex items-center justify-center gap-2"
            )}
          >
            <CheckCircle className="w-5 h-5" />
            Book Now
          </button>
          <button
            onClick={handleReset}
            className={getSeatClassNames(
                "w-full max-w-sm mt-4 bg-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700",
                "transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center gap-2"
            )}
          >
            <RotateCw className="w-5 h-5" />
            Reset Booking
          </button>
        </div>
      </div>
      {error && (
          <div className="absolute bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <AlertCircle className="h-4 w-4 mr-2 inline-block" />
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
    </div>
  );
};

const SeatMap = ({ seats }: { seats: number[][] }) => {
    let seatNumber = 1;
    const bookedCount = seats.flat().filter(seat => seat === 1).length;
    const availableCount = seats.flat().length - bookedCount;

    const getSeatClassNames = (...classes: string[]) => {
        return classes.filter(Boolean).join(' ');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-7 gap-4 flex-1 overflow-auto p-4">
                {seats.map((row, rowIndex) =>
                    row.map((seat, colIndex) => {
                        let additionalClasses = "";
                        if (rowIndex === 11) {
                            additionalClasses = "col-span-2";
                        }
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={getSeatClassNames(
                                    "w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-110",
                                    seat === 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600',
                                    additionalClasses
                                )}
                            >
                                <span className="text-lg">{seatNumber++}</span>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="mt-6 flex justify-center space-x-8">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-yellow-500 text-white shadow-md text-lg">
                    Booked: {bookedCount}
                </div>
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-500 text-white shadow-md text-lg">
                    Available: {availableCount}
                </div>
            </div>
        </div>
    );
};

export default SeatBooking;

