import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [createdTickets, setCreatedTickets] = useState([]);
  const [requestedTickets, setRequestedTickets] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch created tickets
      const createdResponse = await fetch('http://localhost:5000/tickets/my-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!createdResponse.ok) {
        throw new Error('Failed to fetch created tickets');
      }
      
      const createdData = await createdResponse.json();
      setCreatedTickets(createdData);

      // Fetch requested tickets
      const requestedResponse = await fetch('http://localhost:5000/tickets/requested-tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!requestedResponse.ok) {
        throw new Error('Failed to fetch requested tickets');
      }
      
      const requestedData = await requestedResponse.json();
      setRequestedTickets(requestedData);

      // Fetch incoming requests
      const incomingResponse = await fetch('http://localhost:5000/tickets/incoming-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!incomingResponse.ok) {
        throw new Error('Failed to fetch incoming requests');
      }
      
      const incomingData = await incomingResponse.json();
      setIncomingRequests(incomingData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Failed to load dashboard data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const handleAcceptRequest = async (ticketId, userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/tickets/${ticketId}/accept-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('Request accepted successfully');
        // Refresh all dashboard data to show updated statuses
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(`Failed to accept request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('An error occurred while accepting the request');
    }
  };

  const handleRejectRequest = async (ticketId, userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/tickets/${ticketId}/reject-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('Request rejected successfully');
        // Refresh all dashboard data to show updated statuses
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(`Failed to reject request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('An error occurred while rejecting the request');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-ticket/${id}`);
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
      <h1 className="text-3xl font-bold mb-8 text-center">My Dashboard</h1>
      
      {/* Created Tickets Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Created Tickets</h2>
        {createdTickets.length === 0 ? (
          <EmptyState message="No tickets created yet." />
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
                      ticket.status === 'sold' 
                        ? 'bg-red-500' 
                        : ticket.status === 'under_discussion'
                        ? 'bg-purple-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {ticket.status === 'sold' 
                      ? 'Sold Out' 
                      : ticket.status === 'under_discussion'
                      ? 'Under Discussion'
                      : 'Available'}
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

      {/* Incoming Requests Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Incoming Requests</h2>
        {incomingRequests.length === 0 ? (
          <EmptyState message="No incoming requests at the moment." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingRequests.map((request) => (
              <div
                key={`${request.ticketId}-${request.userId}`}
                className="p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                style={{
                  backgroundColor: 'var(--card-color)',
                  color: 'var(--text-color)',
                  borderLeft: request.status === 'accepted' 
                    ? '4px solid #22c55e' 
                    : request.status === 'rejected'
                    ? '4px solid #ef4444'
                    : '4px solid #f59e0b',
                }}
              >
                <p>
                  <strong>Ticket:</strong> {request.ticketTitle}
                </p>
                <p>
                  <strong>Requested By:</strong> {request.username}
                </p>
                
                {/* Status display */}
                <p className="mt-2">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-lg text-white font-semibold ${
                      request.status === 'accepted' 
                        ? 'bg-green-500' 
                        : request.status === 'rejected'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {request.status === 'accepted' 
                      ? 'Accepted' 
                      : request.status === 'rejected'
                      ? 'Rejected'
                      : 'Pending'}
                  </span>
                </p>
                
                {/* Only show action buttons for pending requests */}
                {request.status === 'pending' && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleAcceptRequest(request.ticketId, request.userId)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.ticketId, request.userId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requested Tickets Section */}
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
                  <strong>Status:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-lg text-white font-semibold ${
                      ticket.status === 'sold' && !ticket.showContactNumber
                        ? 'bg-red-500'
                        : ticket.userStatus === 'accepted'
                        ? 'bg-green-500'
                        : ticket.userStatus === 'rejected'
                        ? 'bg-red-500'
                        : ticket.status === 'under_discussion' && !ticket.showContactNumber
                        ? 'bg-purple-500'
                        : ticket.userStatus === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {ticket.status === 'sold' && !ticket.showContactNumber
                      ? 'Sold Out'
                      : ticket.userStatus === 'accepted'
                      ? 'Accepted'
                      : ticket.userStatus === 'rejected'
                      ? 'Rejected'
                      : ticket.status === 'under_discussion' && !ticket.showContactNumber
                      ? 'Under Discussion'
                      : ticket.userStatus === 'pending'
                      ? 'Pending'
                      : 'Available'}
                  </span>
                </p>
                <p>
                  <strong>Created By:</strong> {ticket.createdBy.username}
                </p>
                {/* Only show contact number if this user's request was accepted */}
                {ticket.showContactNumber && (
                  <p className="mt-2 p-2 bg-green-100 text-green-800 rounded-lg">
                    <strong>Contact Number:</strong> {ticket.contactNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;