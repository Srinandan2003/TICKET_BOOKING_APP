import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance.js';

const SeatGrid = () => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      const token = localStorage.getItem("Authorization");
      try {
        const response = await axiosInstance.get("/api/seat/status", {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data);
        setSeats(response.data); // ✅ assuming the backend sends "seats"
      } catch (err) {
        console.error("Error fetching seat data:", err);
      }
    };

    fetchSeats();
  }, []);

  return (
    <div className="grid gap-2 p-4">
      {seats.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((seat, seatIndex) => (
            <div
              key={seatIndex}
              className={`w-6 h-6 text-xs flex items-center justify-center rounded 
                ${seat === 1 ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {seatIndex + 1}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
