import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center h-16">
        <NavLink to="/" className="text-xl font-bold flex items-center">
          <span className="text-white">Ticket</span>
          <span className="text-blue-200">App</span>
        </NavLink>
        
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
        <div className="hidden md:flex md:items-center md:space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-md transition-all ${
                isActive
                  ? 'bg-white text-blue-500 font-semibold'
                  : 'hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          
          <button
            onClick={toggleTheme}
            className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition-all flex items-center"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-500 font-semibold">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    Signed in as <span className="font-semibold">{username || 'User'}</span>
                  </div>
                  <NavLink 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/signup"
              className="ml-2 bg-white text-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Get Started
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 max-w-xs w-full bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden z-[60]`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-center p-4 border-b border-blue-500">
              <h3 className="text-xl font-bold">Menu</h3>
              <button
                className="text-white focus:outline-none"
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
            </div>

            <div className="flex flex-col p-4 space-y-3">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-base transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'hover:bg-blue-500'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              
              {token && (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-lg text-base transition-all ${
                        isActive
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'hover:bg-blue-500'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/browse-openings"
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-lg text-base transition-all ${
                        isActive
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'hover:bg-blue-500'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Tickets
                  </NavLink>
                  <NavLink
                    to="/create-opening"
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-lg text-base transition-all ${
                        isActive
                          ? 'bg-white text-blue-600 font-semibold'
                          : 'hover:bg-blue-500'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Ticket
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all"
            >
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all text-white font-medium"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/signup"
                className="block w-full text-center px-4 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </NavLink>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-60 z-[55] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;