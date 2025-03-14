import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchMessages } from '../../api/messages';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (user?.role === 'admin') {
          const data = await fetchMessages();
          setMessages(data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [user]);

  if (loading) return <div>Loading messages...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  if (!user || user.role !== 'admin') {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">User Messages</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Message</th>
              <th className="text-left p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr
                key={message._id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-4">{message.user?.name || message.name}</td>
                <td className="p-4">{message.user?.email || message.email}</td>
                <td className="p-4">{message.subject}</td>
                <td className="p-4 max-w-xs">{message.message}</td>
                <td className="p-4">
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <div className="space-y-2">
              <div>
                <p className="font-semibold">Name</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {message.user?.name || message.name}
                </p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {message.user?.email || message.email}
                </p>
              </div>
              <div>
                <p className="font-semibold">Subject</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {message.subject}
                </p>
              </div>
              <div>
                <p className="font-semibold">Message</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {message.message}
                </p>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}