import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="text-center pt-[4rem] px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
          Welcome to
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            TicketApp
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Buy and sell train tickets easily among peers. Simplify your travel plans with TicketApp.
        </p>
        <div className="flex justify-center space-x-6">
          <Link to="/create-opening">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
              Create Opening
            </button>
          </Link>
          <Link to="/browse-openings">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
              Browse Openings
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 mt-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">
            Why Choose TicketApp?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Easy Ticket Creation
              </h3>
              <p className="text-gray-600">
                Create ticket openings effortlessly and manage your travel plans with ease.
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Browse Openings
              </h3>
              <p className="text-gray-600">
                Explore available tickets and find the perfect match for your travel needs.
              </p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Seamless Requests
              </h3>
              <p className="text-gray-600">
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