import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Overview } from '../../components/dashboard/Overview';
import { Products } from '../../components/dashboard/Products';
import { Users } from '../../components/dashboard/Users';
import { Orders } from '../../components/dashboard/Orders';
import { Profile } from '../../components/dashboard/Profile';
import { Messages } from '../../components/dashboard/Messages';
import { Menu } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(''); // Initialize as empty
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      setActiveTab(user.role === 'admin' ? 'overview' : 'profile');
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'products':
        return user.role === 'admin' ? <Products /> : null;
      case 'users':
        return user.role === 'admin' ? <Users /> : null;
      case 'messages':
        return user.role === 'admin' ? <Messages /> : null;
      case 'orders':
        return <Orders />;
      case 'profile':
        return <Profile />;
      default:
        return null; // Return null until the initial tab is set
    }
  };

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
                    ? user.role === 'admin' ? 'All Orders' : 'My Orders'
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {error && (
              <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`}>
                {error}
              </div>
            )}

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}