import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { submitMessage } from '../api/messages'; // Import the API function

export function Contact() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDarkMode = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitMessage(
        formData.name,
        formData.email,
        formData.subject,
        formData.message,
        user?._id
      );

      // Reset form and show success message
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Check if the user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
    >
      {/* Hero Section */}
      <div
        className={`py-20 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            We're here to help! Reach out to us with any questions or concerns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  title: 'Address',
                  desc: 'Mumbai',
                },
                { icon: Phone, title: 'Phone', desc: '+91 9076452426' },
                {
                  icon: Mail,
                  title: 'Email',
                  desc: 'malusaresheyash01@gmail.com',
                },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <Icon
                    className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                  />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p
                      className={`opacity-90 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 h-96"> {/* h-96 is equivalent to 24rem (384px) */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.755837866462!2d72.8332153153846!3d19.03374445825173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce6e93c9e4b7%3A0x2a5f5b5b5b5b5b5b!2sMumbai%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sin!4v1645890124885!5m2!1sen!2sin"
                className="w-full h-full rounded-lg"
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`p-8 rounded-lg shadow-md transition-all ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
          >
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
                Message sent successfully!
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: 'Name', type: 'text', name: 'name' },
                { label: 'Email', type: 'email', name: 'email' },
                { label: 'Subject', type: 'text', name: 'subject' },
              ].map(({ label, type, name }) => (
                <div key={name}>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 transition-colors ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:ring-gray-500'
                      : 'border-gray-300 focus:ring-black'
                      }`}
                    required
                  />
                </div>
              ))}

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-3 border rounded-md focus:ring-2 transition-colors ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 focus:ring-gray-500'
                    : 'border-gray-300 focus:ring-black'
                    }`}
                  required
                ></textarea>
              </div>

              {/* Send Message Button */}
              <button
                type="submit"
                disabled={isSubmitting || isAdmin} // Disable for admins
                className={`w-full py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-black text-white hover:bg-gray-800'
                  } ${isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send size={20} />
                {isAdmin
                  ? 'Only users can send messages'
                  : isSubmitting
                    ? 'Sending...'
                    : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
