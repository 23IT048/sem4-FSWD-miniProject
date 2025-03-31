import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  startLocation: String,
  endLocation: String,
  departureTime: Date,
  arrivalTime: Date,
  status: { type: String, default: 'available' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;