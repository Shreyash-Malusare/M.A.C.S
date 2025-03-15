import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  size: string;
  price: number;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  total: number;
  paymentId: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  address: string; // Added address field
}

export const Orders = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const endpoint = user?.role === 'admin'
          ? `${VITE_FRONT_END_IP}/api/orders/all`
          : `${VITE_FRONT_END_IP}/api/orders?userId=${user?._id}`;

        const response = await axios.get(endpoint);
        setOrders(response.data);
      } catch (e) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const downloadInvoice = (order: Order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('MACS', 14, 22);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.text(`Invoice #${order._id.slice(-8).toUpperCase()}`, 160, 22);
    doc.setFontSize(10);
    doc.text('237 Fashion Street\nMira-Bhayander, ZIP 401105', 14, 30);

    // Billed To
    doc.setFontSize(12);
    doc.text('Billed To:', 14, 50);
    doc.setFontSize(10);

    const billedTo = [
      order.userId.name || 'N/A',
      order.userId.email || 'N/A',
      order.userId.phone ? order.userId.phone : 'N/A',
      `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      `Status: ${order.status}`,
    ].filter(Boolean);

    doc.text(billedTo, 14, 55);

    // Shipping Address
    doc.setFontSize(12);
    doc.text('Shipping Address:', 14, 75);
    doc.setFontSize(10);
    doc.text(order.address, 14, 80);

    // Items Table
    const itemsData = order.items.map((item) => [
      item.product.name,
      item.size,
      item.quantity.toString(),
      `₹${(item.price * item.quantity).toFixed(2)}`,
    ]);

    (doc as any).autoTable({
      startY: 100, // Adjust startY to accommodate the address
      head: [['Product', 'Size', 'Qty', 'Price']],
      body: itemsData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 1.5 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        3: { halign: 'right' },
      },
    });

    // Total Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${order.total.toFixed(2)}`, 160, finalY);
    doc.text(`Payment Status: ${order.paymentStatus}`, 160, finalY + 5);
    doc.text(`Total: ₹${order.total.toFixed(2)}`, 160, finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for shopping with us!', 14, finalY + 20);
    doc.text('Contact: support@fashionstore.com | Phone: (555) 123-4567', 14, finalY + 25);

    doc.save(`invoice_${order._id}.pdf`);
  };

  if (!user) return null;

  return (
    <div className="space-y-4 p-4">
      {error && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center p-8">
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No orders found
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
              >
                <div className="flex flex-col gap-2">
                  {user.role === 'admin' && (
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {order.userId.name}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {order.userId.email}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 border-b pb-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.product.name}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Display the address */}
                  <div className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="font-medium">Shipping Address:</p>
                    <p>{order.address}</p>
                  </div>

                  <button
                    onClick={() => downloadInvoice(order)}
                    className={`mt-2 w-full py-2 rounded-md ${isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className={`hidden md:block rounded-lg shadow-sm overflow-x-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <table className="w-full">
              <thead className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <tr>
                  {user.role === 'admin' && <th className="p-4 text-left">User</th>}
                  <th className="p-4 text-left">Items</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Payment ID</th>
                  <th className="p-4 text-left">Address</th> {/* New column */}
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    {user.role === 'admin' && (
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {order.userId.name}
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {order.userId.email}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.product.name}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Size: {item.size} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className={`p-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className="text-sm font-mono">{order.paymentId.slice(0, 8)}...</span>
                    </td>
                    <td className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {order.address} {/* Display the address */}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className={`px-4 py-2 rounded-md ${isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
