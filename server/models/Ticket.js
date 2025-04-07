import mongoose from 'mongoose';

// Define a schema for request status
const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
  startLocation: String,
  endLocation: String,
  departureTime: Date,
  arrivalTime: Date,
  status: { type: String, default: 'available' }, // available, under_discussion, sold
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Replace requestedBy with requests that include status
  requests: [requestSchema],
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