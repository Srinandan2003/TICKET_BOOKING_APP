import mongoose from 'mongoose'

const seatSchema = new mongoose.Schema({
  seats: {
    type: [[Number]],
    default: (() => {
      const totalSeats = 80;
      const seatsPerRow = 7;
      const fullRows = Math.floor(totalSeats / seatsPerRow); // 11
      const remainder = totalSeats % seatsPerRow; // 3

      const layout = [];

      for (let i = 0; i < fullRows; i++) {
        layout.push(Array(seatsPerRow).fill(0));
      }

      if (remainder > 0) {
        layout.push(Array(remainder).fill(0)); // last row with 3 seats
      }

      return layout;
    })()
  },
  bookings: [{
    userId: mongoose.Schema.Types.ObjectId,
    row: Number,
    col: Number
  }]
});

const Seat = mongoose.model('seats', seatSchema);

export default Seat;
