import { useEffect, useState } from 'react';

function UserDashboard() {
  const [createdTickets, setCreatedTickets] = useState([]);
  const [requestedTickets, setRequestedTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchCreatedTickets = async () => {
      const response = await fetch('http://localhost:5000/my-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCreatedTickets(data);
    };

    const fetchRequestedTickets = async () => {
      const response = await fetch('http://localhost:5000/requested-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequestedTickets(data);
    };

    fetchCreatedTickets();
    fetchRequestedTickets();
  }, []);

  return (
    <div
      className="pt-[8rem] px-[5rem] min-h-screen"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
          Created Tickets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <strong>Status:</strong> {ticket.status}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
          Requested Tickets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <strong>Created By:</strong> {ticket.createdBy.username}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;