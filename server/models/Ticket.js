import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  startLocation: String,
  endLocation: String,
  departureTime: Date,
  arrivalTime: Date,
  status: { type: String, default: 'available' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  price: { 
    type: Number, 
    required: true, 
    min: 0 // Ensure price is non-negative 
  },
  contactNumber: { 
    type: String, 
    required: true, 
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Example: Validate 10-digit phone numbers
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;