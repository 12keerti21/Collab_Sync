import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { Bell, Menu, X, LogOut, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
            <img src="/lg.png" alt="CollabSync Logo" className="h-6 w-6 object-contain" />
          </div>
          <span>CollabSync</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {user && (
            <>
              {user.role === 'provider' && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
                  <Link to="/tasks" className="text-gray-600 hover:text-primary-600">Tasks</Link>
                  <Link to="/clients" className="text-gray-600 hover:text-primary-600">Clients</Link>
                  <Link to="/analytics" className="text-gray-600 hover:text-primary-600">Analytics</Link>
                </>
              )}
              {user.role === 'client' && (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
                  <Link to="/tasks" className="text-gray-600 hover:text-primary-600">My Tasks</Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center space-x-3">
            <button className="relative text-gray-500 hover:text-primary-600">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-xs text-white">
                3
              </span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="hidden text-sm font-medium text-gray-700 md:inline-block">
                  {user.name}
                </span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && user && (
        <div className="border-t border-gray-200 bg-white px-4 py-2 md:hidden">
          <nav className="flex flex-col space-y-2">
            {user.role === 'provider' && (
              <>
                <Link
                  to="/dashboard"
                  className="py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tasks
                </Link>
                <Link
                  to="/clients"
                  className="py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clients
                </Link>
                <Link
                  to="/analytics"
                  className="py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analytics
                </Link>
              </>
            )}
            {user.role === 'client' && (
              <>
                <Link
                  to="/dashboard"
                  className="py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Tasks
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center py-2 text-gray-600 hover:text-primary-600"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;