import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Package, ShoppingBag, Clock } from 'lucide-react';
import { orderApi } from '../../api/orders';

// Type definitions
interface Order {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
  items: any[];
}

interface SalesData {
  name: string;
  sales: number;
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  darkMode: boolean;
}

export const Overview = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [adminData, setAdminData] = useState<{
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    salesData: SalesData[];
  }>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    salesData: [],
  });

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const orders: Order[] = await orderApi.getAllOrders();
        const salesData = processSalesData(orders);

        setAdminData({
          totalRevenue: orders.reduce((sum: number, order: Order) => sum + order.total, 0),
          totalOrders: orders.length,
          pendingOrders: orders.filter((order: Order) => order.status === 'pending').length,
          salesData,
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  // Process sales data for the chart
  const processSalesData = (orders: Order[]): SalesData[] => {
    const monthlySales = orders.reduce((acc: { [key: number]: number }, order: Order) => {
      const month = new Date(order.createdAt).getMonth();
      acc[month] = (acc[month] || 0) + order.total;
      return acc;
    }, {});

    return Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      sales: monthlySales[i] || 0,
    }));
  };

  // Only render admin dashboard
  if (user?.role !== 'admin') {
    return <div className="p-6 text-center">You do not have access to this page.</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Admin Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Revenue"
          value={`₹${adminData.totalRevenue.toLocaleString()}`}
          icon={<ShoppingBag size={24} className="text-indigo-600" />}
          darkMode={isDarkMode}
        />
        <DashboardCard
          title="Total Orders"
          value={adminData.totalOrders}
          icon={<Package size={24} className="text-green-600" />}
          darkMode={isDarkMode}
        />
        <DashboardCard
          title="Pending Orders"
          value={adminData.pendingOrders}
          icon={<Clock size={24} className="text-yellow-600" />}
          darkMode={isDarkMode}
        />
      </div>

      {/* Sales Overview Chart */}
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminData.salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4A5568' : '#E2E8F0'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#CBD5E0' : '#4A5568'} />
              <YAxis stroke={isDarkMode ? '#CBD5E0' : '#4A5568'} />
              <Tooltip
                contentStyle={{
                  background: isDarkMode ? '#2D3748' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="sales" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable Dashboard Card Component
const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, darkMode }) => (
  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);