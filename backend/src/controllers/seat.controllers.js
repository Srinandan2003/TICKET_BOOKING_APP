import Seat from '../models/Seat.models.js';

export const bookSeat = async (req, res) => {
    try {
      const { count } = req.body;
      const userId = req.user.userId; 
  
  
      if (count < 1 || count > 7) {
        return res.status(400).json({ message: "You can only book between 1 and 7 seats at a time." });
      }
  
      let seatDoc = await Seat.findOne();
      if (!seatDoc) seatDoc = await Seat.create({});

      const seats = seatDoc.seats;
      let bookedSeats = [];
  
      // continuous seats
      for (let i = 0; i < seats.length; i++) {
        for (let j = 0; j <= 7 - count; j++) {
          if (seats[i].slice(j, j + count).every(seat => seat === 0)) {
            for (let k = j; k < j + count; k++) {
              seats[i][k] = 1;
              bookedSeats.push({ userId, row: i, col: k });
            }
            seatDoc.bookings.push(...bookedSeats);
            await seatDoc.save();
            return res.json({
              message: `Successfully booked ${count} continuous seats.`,
              bookedSeats,
              fullSeats: seats
            });
          }
        }
      }
  
     // scattered - find the closest available 'count' seats
let flatSeats = [];
const cols = seats[0].length;

for (let i = 0; i < seats.length; i++) {
  for (let j = 0; j < seats[i].length; j++) {
    if (seats[i][j] === 0) {
      flatSeats.push({ row: i, col: j, index: i * cols + j });
    }
  }
}

if (flatSeats.length < count) {
  return res.status(400).json({ message: "Not enough seats available to fulfill this request." });
}

// Sliding window to find closest `count` seats
let minSpread = Infinity;
let bestWindow = [];

for (let i = 0; i <= flatSeats.length - count; i++) {
  const window = flatSeats.slice(i, i + count);
  const spread = window[count - 1].index - window[0].index;
  if (spread < minSpread) {
    minSpread = spread;
    bestWindow = window;
  }
}

// Book selected seats
for (const seat of bestWindow) {
  seats[seat.row][seat.col] = 1;
  bookedSeats.push({ userId, row: seat.row, col: seat.col });
}

seatDoc.bookings.push(...bookedSeats);
await seatDoc.save();

return res.json({
  message: `No continuous block found. Booked ${count} closest scattered seats.`,
  bookedSeats,
  fullSeats: seats
});

    
  
      res.status(400).json({ message: "Not enough seats available to fulfill this request." });
    } catch (error) {
      console.error("Booking error:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }


  export const status = async (req, res) => {
    try {
      let seatDoc = await Seat.findOne(); // Try fetching the first document
  
      if (!seatDoc) { 
        console.log('No seat document found. Creating a new one...');
        seatDoc = await Seat.create({}); // If not found, create a new one
      }
  
      console.log('Seat Document:', seatDoc); // Log the entire document for debugging
  
      // Ensure that `seats` exists and is populated
      if (!seatDoc.seats) {
        console.log('Seats field is undefined, initializing default...');
        seatDoc.seats = Array(80).fill().map(() => Array(7).fill(0)); // Initialize it if undefined
        await seatDoc.save(); // Save the new document with seats initialized
      }
  
      res.json(seatDoc.seats); // Send the seats array as response
    } catch (err) {
      console.error('Error fetching seat data:', err);
      res.status(500).send('Internal Server Error');
    }
  }

  export const resetBookings = async (req, res) => {
    try {
      let seatDoc = await Seat.findOne();
  
      if (!seatDoc) {
        seatDoc = await Seat.create({});
      }
  
      // Reset all seats to 0 (available)
      seatDoc.seats = Array(80).fill().map(() => Array(7).fill(0));
  
      // Clear all bookings
      seatDoc.bookings = [];
  
      await seatDoc.save();
  
      res.json({ message: "All bookings have been reset.", fullSeats: seatDoc.seats });
    } catch (error) {
      console.error("Reset error:", error.message);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  