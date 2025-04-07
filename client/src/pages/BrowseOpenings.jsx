import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BrowseOpenings() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch tickets function
  const fetchTickets = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/tickets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setTickets(data);
    } else {
      console.error('Failed to fetch tickets:', response.statusText);
      setTickets([]); // Set an empty array to avoid breaking the UI
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets(); // Fetch tickets on component mount
  }, []);

  const handleRequest = async (id, isRequested) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5000/tickets/${id}/${isRequested ? 'cancel-request' : 'request'}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert(isRequested ? 'Request cancelled successfully' : 'Request sent successfully');
      // Refresh tickets to update the UI
      await fetchTickets();
    } else {
      alert('Failed to update request status');
    }
  };

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
      className="mt-[8rem] min-h-screen p-4 sm:p-8"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Browse Tickets</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg">Loading tickets...</p>
        </div>
      ) : Array.isArray(tickets) && tickets.length === 0 ? (
        <EmptyState message="No tickets available at the moment." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(tickets) &&
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-all ${
                  ticket.status === 'sold' ? 'opacity-85' : ''
                }`}
                style={{
                  backgroundColor: 'var(--card-color)',
                  color: 'var(--text-color)',
                  borderLeft: ticket.status === 'sold' ? '4px solid #ef4444' : '4px solid #22c55e',
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
                      ticket.status === 'sold' 
                        ? 'bg-red-500'
                        : ticket.status === 'under_discussion'
                        ? 'bg-purple-500'
                        : ticket.userStatus === 'pending'
                        ? 'bg-yellow-500'
                        : ticket.userStatus === 'rejected'
                        ? 'bg-red-500'
                        : ticket.userStatus === 'accepted'
                        ? 'bg-green-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {ticket.status === 'sold'
                      ? 'Sold Out'
                      : ticket.status === 'under_discussion'
                      ? 'Under Discussion'
                      : ticket.userStatus === 'pending'
                      ? 'Pending'
                      : ticket.userStatus === 'rejected'
                      ? 'Rejected'
                      : ticket.userStatus === 'accepted'
                      ? 'Accepted'
                      : 'Available'}
                  </span>
                </p>
                {ticket.createdBy._id === userId ? (
                  <button
                    onClick={() => handleEdit(ticket._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg w-full"
                  >
                    Edit Ticket
                  </button>
                ) : ticket.isRequested ? (
                  <button
                    onClick={() => handleRequest(ticket._id, true)} // Cancel request
                    className="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg w-full"
                    disabled={ticket.status === 'sold'}
                  >
                    Cancel Request
                  </button>
                ) : (
                  <button
                    onClick={() => handleRequest(ticket._id, false)} // Send request
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 mt-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg w-full"
                    disabled={ticket.createdBy._id === userId || ticket.status !== 'available'}
                  >
                    Request Ticket
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default BrowseOpenings;