import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart,
  MessageSquare,
  Settings,
  HelpCircle,
  User,
} from 'lucide-react';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  role: 'provider' | 'client' | 'both';
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
    role: 'both',
  },
  {
    title: 'Tasks',
    path: '/tasks',
    icon: <CheckSquare size={20} />,
    role: 'both',
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: <Users size={20} />,
    role: 'provider',
  },
  {
    title: 'Analytics',
    path: '/analytics',
    icon: <BarChart size={20} />,
    role: 'provider',
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: <MessageSquare size={20} />,
    role: 'both',
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <User size={20} />,
    role: 'both',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings size={20} />,
    role: 'both',
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => {
    if (!user) return false;
    return item.role === 'both' || item.role === user.role;
  });

  return (
    <aside className="flex h-full w-56 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex-1 space-y-1 px-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4">
        <NavLink
          to="/help"
          className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <HelpCircle size={20} className="mr-3" />
          Help & Support
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;