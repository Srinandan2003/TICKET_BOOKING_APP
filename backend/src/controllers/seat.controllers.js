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
  
      const userBookedCount = seatDoc.bookings.filter(b => b?.userId?.toString() === userId).length;
  
      if (userBookedCount + count > 7) {
        return res.status(400).json({
          message: `Booking failed. You already booked ${userBookedCount} seats. You can only book ${7 - userBookedCount} more.`
        });
      }
  
      const seats = seatDoc.seats;
      let bookedSeats = [];
  
      // Try continuous seats first
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
  
      // Try scattered seats
      for (let i = 0; i < seats.length && bookedSeats.length < count; i++) {
        for (let j = 0; j < seats[i].length && bookedSeats.length < count; j++) {
          if (seats[i][j] === 0) {
            seats[i][j] = 1;
            bookedSeats.push({ userId, row: i, col: j });
          }
        }
      }
  
      if (bookedSeats.length === count) {
        seatDoc.bookings.push(...bookedSeats);
        await seatDoc.save();
        return res.json({
          message: `No continuous block found. Booked ${count} nearest available seats.`,
          bookedSeats,
          fullSeats: seats
        });
      }
  
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