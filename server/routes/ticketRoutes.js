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
  try {
    // Get all tickets
    const tickets = await Ticket.find().populate('createdBy', 'username');

    // Add user-specific status for tickets requested by the current user
    const userId = req.user.id;
    const updatedTickets = tickets.map((ticket) => {
      // Find the user's request if it exists
      const userRequest = ticket.requests.find(
        request => request.userId.toString() === userId
      );
      
      // Determine user-specific status based on their request
      const userStatus = userRequest ? userRequest.status : null;
      
      return {
        ...ticket.toObject(),
        userStatus,
        showContactNumber: userRequest && userRequest.status === 'accepted',
        // Add a flag to easily check if user requested this ticket
        isRequested: !!userRequest
      };
    });

    res.send(updatedTickets);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch tickets', details: error.message });
  }
});

// Get My Tickets
router.get('/my-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.send(tickets);
});

// Get Requested Tickets
router.get('/requested-tickets', authenticate, async (req, res) => {
  try {
    // Find tickets where the user has made a request
    const tickets = await Ticket.find({
      "requests.userId": req.user.id
    }).populate('createdBy', 'username');

    // Add user-specific information to each ticket
    const updatedTickets = tickets.map((ticket) => {
      // Find this user's request
      const userRequest = ticket.requests.find(
        request => request.userId.toString() === req.user.id
      );
      
      return {
        ...ticket.toObject(),
        userStatus: userRequest ? userRequest.status : 'pending', // Use the stored status
        showContactNumber: userRequest && userRequest.status === 'accepted', // Only show contact for accepted requests
      };
    });

    res.send(updatedTickets);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch requested tickets', details: error.message });
  }
});

// Cancel Ticket Request
router.post('/:id/cancel-request', authenticate, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

    // Find and remove the user's request
    ticket.requests = ticket.requests.filter(
      (request) => request.userId.toString() !== req.user.id
    );

    await ticket.save();
    res.send({ message: 'Request canceled successfully', ticket });
  } catch (error) {
    res.status(500).send({ error: 'Failed to cancel request', details: error.message });
  }
});

// Request Ticket
router.post('/:id/request', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  // Check if the user has already requested the ticket
  const existingRequest = ticket.requests.find(
    (request) => request.userId.toString() === req.user.id
  );
  
  if (existingRequest) {
    return res.status(400).send({ error: 'You have already requested this ticket' });
  }

  // Add new request with pending status
  ticket.requests.push({
    userId: req.user.id,
    status: 'pending'
  });
  
  await ticket.save();
  res.send({ message: 'Request sent successfully', ticket });
});

// Fetch Incoming Requests
router.get('/incoming-requests', authenticate, async (req, res) => {
  try {
    // Get tickets created by the current user that aren't sold yet
    const tickets = await Ticket.find({ 
      createdBy: req.user.id,
      status: { $ne: 'sold' } // Don't show sold tickets
    }).populate({
      path: 'requests.userId',
      select: 'username'
    });

    // For each ticket, get all its requests with status information
    const incomingRequests = [];
    
    for (const ticket of tickets) {
      // For each request on this ticket
      for (const request of ticket.requests) {
        incomingRequests.push({
          ticketId: ticket._id,
          ticketTitle: `${ticket.startLocation} to ${ticket.endLocation}`,
          ticketStatus: ticket.status,
          userId: request.userId._id,
          username: request.userId.username,
          status: request.status // This is the key - use the stored status directly
        });
      }
    }

    res.send(incomingRequests);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch incoming requests', details: error.message });
  }
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

// Accept Request
router.post('/:id/accept-request', authenticate, async (req, res) => {
  const { userId } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    // Find the request by userId
    const requestIndex = ticket.requests.findIndex(
      request => request.userId.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(400).send({ error: 'User has not requested this ticket' });
    }

    // Check if status is 'sold' - can't accept requests for sold tickets
    if (ticket.status === 'sold') {
      return res.status(400).send({ error: 'This ticket is already sold' });
    }

    // Update status to 'accepted'
    ticket.requests[requestIndex].status = 'accepted';

    // Update ticket status to under_discussion if it's currently available
    if (ticket.status === 'available') {
      ticket.status = 'under_discussion';
    }

    await ticket.save();
    res.send({ message: 'Request accepted successfully', ticket });
  } catch (error) {
    res.status(500).send({ error: 'Failed to accept request', details: error.message });
  }
});

// Reject Request
router.post('/:id/reject-request', authenticate, async (req, res) => {
  const { userId } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).send({ error: 'Unauthorized' });
    }

    // Find the request by userId
    const requestIndex = ticket.requests.findIndex(
      request => request.userId.toString() === userId
    );

    if (requestIndex === -1) {
      return res.status(400).send({ error: 'User has not requested this ticket' });
    }

    // Update status to 'rejected'
    ticket.requests[requestIndex].status = 'rejected';
    
    // If this was previously accepted and now we're rejecting it, check if we need to update ticket status
    const acceptedRequestsRemaining = ticket.requests.some(
      request => request.status === 'accepted'
    );
    
    if (!acceptedRequestsRemaining && ticket.status === 'under_discussion') {
      ticket.status = 'available';
    }
    
    await ticket.save();
    res.send({ message: 'Request rejected successfully', ticket });
  } catch (error) {
    res.status(500).send({ error: 'Failed to reject request', details: error.message });
  }
});

export default router;