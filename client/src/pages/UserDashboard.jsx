import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [createdTickets, setCreatedTickets] = useState([]);
  const [requestedTickets, setRequestedTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedTickets = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCreatedTickets(data);
    };

    const fetchRequestedTickets = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/tickets/requested-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequestedTickets(data);
    };

    fetchCreatedTickets();
    fetchRequestedTickets();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-ticket/${id}`); // Navigate to the edit page
  };

  const EmptyState = ({ message }) => (
    <div
      className="flex items-center justify-center h-40 rounded-lg"
      style={{
        backgroundColor: 'var(--card-color)',
        color: 'var(--text-color)',
      }}
    >
      <p className="text-lg font-light text-center opacity-70">{message}</p>
    </div>
  );

  return (
    <div
      className="mt-[10rem] px-4 sm:px-8 min-h-screen"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Created Tickets</h2>
        {createdTickets.length === 0 ? (
          <EmptyState message="You haven't created any tickets yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdTickets.map((ticket) => (
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
                <p>
                  <strong>Price:</strong> ₹{ticket.price}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-lg text-white font-semibold ${
                      ticket.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {ticket.status === 'available' ? 'Available' : 'Sold Out'}
                  </span>
                </p>
                <button
                  onClick={() => handleEdit(ticket._id)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg w-full"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Requested Tickets</h2>
        {requestedTickets.length === 0 ? (
          <EmptyState message="You haven't requested any tickets yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestedTickets.map((ticket) => (
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
                <p>
                  <strong>Price:</strong> ₹{ticket.price}
                </p>
                <p>
                  <strong>Created By:</strong> {ticket.createdBy.username}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;