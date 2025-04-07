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
router.get('/', async (req, res) => {
  const tickets = await Ticket.find({ status: 'available' }).populate('createdBy', 'username');
  res.send(tickets);
});

// Get My Tickets
router.get('/my-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.send(tickets);
});

// Get Requested Tickets
router.get('/requested-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ requestedBy: req.user.id }).populate('createdBy', 'username');
  res.send(tickets);
});

// Request Ticket
router.post('/:id/request', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  ticket.requestedBy.push(req.user.id);
  await ticket.save();
  res.send(ticket);
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