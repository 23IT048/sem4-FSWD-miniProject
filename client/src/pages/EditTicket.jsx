import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditTicket() {
  const { id } = useParams();
  const [form, setForm] = useState({
    startLocation: '',
    endLocation: '',
    departureTime: '',
    arrivalTime: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to fetch ticket');
          return;
        }

        const data = await response.json();

        // Format the datetime values to match "yyyy-MM-ddThh:mm" in local time
        const formatDateTime = (dateString) => {
          const date = new Date(dateString);
          const offset = date.getTimezoneOffset(); // Get the timezone offset in minutes
          const localDate = new Date(date.getTime() - offset * 60 * 1000); // Adjust to local time
          return localDate.toISOString().slice(0, 16); // Extract "yyyy-MM-ddThh:mm"
        };

        setForm({
          startLocation: data.startLocation || '',
          endLocation: data.endLocation || '',
          departureTime: data.departureTime ? formatDateTime(data.departureTime) : '',
          arrivalTime: data.arrivalTime ? formatDateTime(data.arrivalTime) : '',
        });
      } catch (error) {
        console.error('Error fetching ticket:', error);
        alert('An error occurred while fetching the ticket.');
      }
    };

    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      alert('Ticket updated successfully');
      navigate('/dashboard');
    } else {
      alert('Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      alert('Ticket deleted successfully');
      navigate('/dashboard');
    } else {
      alert('Failed to delete ticket');
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
        <h1 className="text-2xl font-bold text-blue-500 mb-6 text-center">Edit Ticket</h1>
        <form onSubmit={handleSave} className="space-y-4">
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
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
            >
              Delete Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTicket;