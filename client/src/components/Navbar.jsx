import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  const token = localStorage.getItem('token');

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center h-16">
        <h1 className="text-xl font-bold">TicketApp</h1>
        {/* Hamburger Menu Toggle Button */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {token && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-lg transition-all ${
                    isActive
                      ? 'bg-white text-blue-500 font-semibold'
                      : 'hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-lg transition-all ${
                    isActive
                      ? 'bg-white text-blue-500 font-semibold'
                      : 'hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={toggleTheme}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          )}
          {!token && (
            <button
              onClick={toggleTheme}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          )}
        </div>
      </div>

      {/* Hamburger Menu */}
      <div
        className={`absolute top-0 left-0 h-screen w-64 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform transition-transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-start space-y-4 p-4">
          {/* Close Button */}
          <button
            className="self-end text-white focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {token && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-lg transition-all ${
                    isActive
                      ? 'bg-white text-blue-500 font-semibold'
                      : 'hover:bg-blue-700 hover:text-white'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-lg transition-all ${
                    isActive
                      ? 'bg-white text-blue-500 font-semibold'
                      : 'hover:bg-blue-700 hover:text-white'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          )}
          {!token && (
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;