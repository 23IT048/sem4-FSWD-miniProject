import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleButtonClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="">
      {/* Hero Section */}
      <section className="text-center pt-[10vh] px-4 sm:px-6 lg:px-8 min-h-[90vh] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold mb-6" style={{ color: 'var(--text-color)' }}>
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            TicketApp
          </span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-color)' }}>
          Buy and sell train tickets easily among peers. Simplify your travel plans with TicketApp.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <button 
            onClick={() => handleButtonClick('/create-opening')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
          >
            Create Opening
          </button>
          <button
            onClick={() => handleButtonClick('/browse-openings')} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
          >
            Browse Openings
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 mt-16 w-full"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: 'var(--text-color)' }}
          >
            Why Choose TicketApp?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div
              className="p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
              style={{
                backgroundColor: 'var(--card-color)',
                color: 'var(--text-color)',
              }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16l-4-4m0 0l4-4m-4 4h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Easy Ticket Creation
              </h3>
              <p style={{ color: 'var(--text-color)' }}>
                Create ticket openings effortlessly and manage your travel plans with ease.
              </p>
            </div>
            <div
              className="p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
              style={{
                backgroundColor: 'var(--card-color)',
                color: 'var(--text-color)',
              }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2v2m0 16v2m8-10h2M2 12H0m16.95 4.95l1.414 1.414M4.636 4.636L3.222 3.222m12.728 12.728l1.414-1.414M4.636 19.364l-1.414-1.414"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Browse Openings
              </h3>
              <p style={{ color: 'var(--text-color)' }}>
                Explore available tickets and find the perfect match for your travel needs.
              </p>
            </div>
            <div
              className="p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
              style={{
                backgroundColor: 'var(--card-color)',
                color: 'var(--text-color)',
              }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h11M9 21V3m0 0l-4 4m4-4l4 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                Seamless Requests
              </h3>
              <p style={{ color: 'var(--text-color)' }}>
                Request tickets with a single click and simplify your ticketing process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;