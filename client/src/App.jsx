import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateOpening from './pages/CreateOpening';
import BrowseOpenings from './pages/BrowseOpenings';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import EditTicket from './pages/EditTicket';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes accessible to all users */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <FAQ />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/create-opening"
          element={
            <PrivateRoute>
              <CreateOpening />
            </PrivateRoute>
          }
        />
        <Route
          path="/browse-openings"
          element={
            <PrivateRoute>
              <BrowseOpenings />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-ticket/:id"
          element={
            <PrivateRoute>
              <EditTicket />
            </PrivateRoute>
          }
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
