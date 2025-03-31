import { useEffect, useState } from 'react';

function BrowseOpenings() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch('http://localhost:5000/tickets');
      const data = await response.json();
      setTickets(data);
    };
    fetchTickets();
  }, []);

  const handleRequest = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/tickets/${id}/request`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      alert('Request sent successfully');
    } else {
      alert('Failed to send request');
    }
  };

  return (
    <div
      className="mt-[8rem] min-h-screen p-4 sm:p-8"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Available Tickets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            style={{
              backgroundColor: 'var(--card-color)',
              color: 'var(--text-color)',
            }}
          >
            <p>
              <strong>From:</strong> {ticket.startLocation}
            </p>
            <p>
              <strong>To:</strong> {ticket.endLocation}
            </p>
            <p>
              <strong>Departure:</strong> {new Date(ticket.departureTime).toLocaleString()}
            </p>
            <p>
              <strong>Arrival:</strong> {new Date(ticket.arrivalTime).toLocaleString()}
            </p>
            <button
              onClick={() => handleRequest(ticket._id)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg w-full"
            >
              Request Ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrowseOpenings;