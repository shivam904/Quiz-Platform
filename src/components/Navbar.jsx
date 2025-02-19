import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:scale-105 transition-transform">
            ✨ Quiz Platform
          </Link>
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-pink-200 transition-colors font-medium"
            >
              🏠 Home
            </Link>
            <Link 
              to="/create" 
              className="text-white hover:text-pink-200 transition-colors font-medium"
            >
              ✏️ Create
            </Link>
            <Link 
              to="/history" 
              className="text-white hover:text-pink-200 transition-colors font-medium"
            >
              📊 History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;