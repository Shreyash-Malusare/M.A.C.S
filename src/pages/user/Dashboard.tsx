import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Menu } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      const defaultTab = user.role === 'admin' ? 'overview' : 'profile';
      if (location.pathname === '/dashboard') {
        navigate(`/dashboard/${defaultTab}`);
      }
      setActiveTab(location.pathname.split('/').pop() || defaultTab);
    }
  }, [user, navigate, location]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 min-h-screen">
          <div className={`shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={`lg:hidden p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Menu size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
                <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeTab === 'orders'
                    ? user?.role === 'admin' ? 'All Orders' : 'My Orders'
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <Outlet /> {/* Render nested routes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
