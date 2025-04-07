import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateOpening() {
  const [form, setForm] = useState({
    startLocation: '',
    endLocation: '',
    departureTime: '',
    arrivalTime: '',
    price: '', // Add price to the form state
    contactNumber: '', // Add contactNumber to the form state
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      alert('Ticket created successfully');
      navigate('/dashboard');
    } else {
      alert('Failed to create ticket');
    }
  };

  return (
    <div className="pt-[4rem] min-h-screen flex items-center justify-center px-4 sm:px-8">
      <div
        className="p-8 rounded-lg shadow-lg max-w-md w-full"
        style={{
          backgroundColor: 'var(--card-color)',
          color: 'var(--text-color)',
        }}
      >
        <h1 className="text-2xl font-bold text-blue-500 mb-6 text-center">Create Ticket Opening</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="startLocation"
            placeholder="Start Location"
            value={form.startLocation}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="endLocation"
            placeholder="End Location"
            value={form.endLocation}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            name="departureTime"
            value={form.departureTime}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            name="arrivalTime"
            value={form.arrivalTime}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (in ₹)"
            value={form.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Create Opening
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOpening;