import { Package, Users, ShoppingBag, User, X, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { id: 'overview', label: 'Overview', icon: Package, path: '/dashboard/overview' },
    { id: 'products', label: 'Products', icon: Package, path: '/dashboard/products' },
    { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
    { id: 'orders', label: 'All Orders', icon: ShoppingBag, path: '/dashboard/orders' },
    { id: 'messages', label: 'Messages', icon: Mail, path: '/dashboard/messages' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  const userNavItems = [
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, path: '/dashboard/orders' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-full w-64 z-40`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={20} className="dark:text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
