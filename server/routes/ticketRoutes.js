import express from 'express';
import Ticket from '../models/Ticket.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Create Ticket
router.post('/', authenticate, async (req, res) => {
  const { startLocation, endLocation, departureTime, arrivalTime, price, contactNumber } = req.body;

  // Validate required fields
  if (!startLocation || !endLocation || !departureTime || !arrivalTime || !price || !contactNumber) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const ticket = new Ticket({
      startLocation,
      endLocation,
      departureTime,
      arrivalTime,
      price,
      contactNumber,
      createdBy: req.user.id,
    });

    await ticket.save();
    res.status(201).send(ticket);
  } catch (error) {
    res.status(500).send({ error: 'Server error', details: error.message });
  }
});

// Get All Tickets
router.get('/', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ status: 'available' }).populate('createdBy', 'username');

  // Add a "pending" status for tickets requested by the current user
  const userId = req.user.id;
  const updatedTickets = tickets.map((ticket) => {
    const isRequestedByUser = ticket.requestedBy.some(
      (requesterId) => requesterId.toString() === userId
    );
    return {
      ...ticket.toObject(),
      userStatus: isRequestedByUser ? 'pending' : ticket.status, // Add user-specific status
    };
  });

  res.send(updatedTickets);
});

// Get My Tickets
router.get('/my-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.send(tickets);
});

// Get Requested Tickets
router.get('/requested-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ requestedBy: req.user.id }).populate('createdBy', 'username');

  // Add a "pending" status for requested tickets
  const updatedTickets = tickets.map((ticket) => ({
    ...ticket.toObject(),
    userStatus: 'pending', // Always show "pending" for requested tickets
  }));

  res.send(updatedTickets);
});

// Cancel Ticket Request
router.post('/:id/cancel-request', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  // Remove the user ID from the requestedBy array
  ticket.requestedBy = ticket.requestedBy.filter(
    (userId) => userId.toString() !== req.user.id
  );

  await ticket.save();
  res.send({ message: 'Request canceled successfully', ticket });
});

// Request Ticket
router.post('/:id/request', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  // Check if the user has already requested the ticket
  if (ticket.requestedBy.includes(req.user.id)) {
    return res.status(400).send({ error: 'You have already requested this ticket' });
  }

  ticket.requestedBy.push(req.user.id);
  await ticket.save();
  res.send({ message: 'Request sent successfully', ticket });
});

// Get Single Ticket
router.get('/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });
  res.send(ticket);
});

// Update Ticket
router.put('/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  if (ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  Object.assign(ticket, req.body);
  await ticket.save();
  res.send(ticket);
});

// Delete Ticket
router.delete('/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  if (ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  await Ticket.deleteOne({ _id: req.params.id });
  res.send({ message: 'Ticket deleted successfully' });
});

export default router;