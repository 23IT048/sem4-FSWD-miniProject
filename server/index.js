import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ticketapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const ticketSchema = new mongoose.Schema({
  startLocation: String,
  endLocation: String,
  departureTime: Date,
  arrivalTime: Date,
  status: { type: String, default: 'available' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who requested the ticket
});

const Ticket = mongoose.model('Ticket', ticketSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).send({ error: 'Username already exists' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send({ error: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ token, userId: user._id });
});

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

// Example of a protected route
app.get('/protected', authenticate, (req, res) => {
  res.send({ message: 'This is a protected route' });
});

app.post('/tickets', authenticate, async (req, res) => {
  const ticket = new Ticket({ ...req.body, createdBy: req.user.id });
  await ticket.save();
  res.status(201).send(ticket);
});

app.get('/tickets', async (req, res) => {
  const tickets = await Ticket.find({ status: 'available' }).populate('createdBy', 'username');
  res.send(tickets);
});

app.get('/my-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.send(tickets);
});

app.post('/tickets/:id/request', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  ticket.requestedBy.push(req.user.id);
  await ticket.save();
  res.send(ticket);
});

app.get('/requested-tickets', authenticate, async (req, res) => {
  const tickets = await Ticket.find({ requestedBy: req.user.id }).populate('createdBy', 'username');
  res.send(tickets);
});

// Get a single ticket
app.get('/tickets/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });
  res.send(ticket);
});

// Update a ticket
app.put('/tickets/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  if (ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  Object.assign(ticket, req.body);
  await ticket.save();
  res.send(ticket);
});

// Delete a ticket
app.delete('/tickets/:id', authenticate, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).send({ error: 'Ticket not found' });

  if (ticket.createdBy.toString() !== req.user.id) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  await Ticket.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
  res.send({ message: 'Ticket deleted successfully' });
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});