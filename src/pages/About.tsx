import { Users, Package, Truck, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Adjust the import path if needed

export function About() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`py-20 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About M.A.C.S.</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            We're on a mission to make fashion accessible, affordable, and sustainable for everyone.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users, title: "Customer First", desc: "We prioritize our customers' satisfaction above everything else." },
            { icon: Package, title: "Quality Products", desc: "We source only the best materials and products for our customers." },
            { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable shipping to your doorstep." },
            { icon: Heart, title: "Sustainable Fashion", desc: "Committed to environmentally conscious fashion choices." },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className={`text-center p-6 rounded-xl shadow-md transition-all ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <Icon className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-primary' : 'text-gray-700'}`} />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 opacity-90">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className={`py-16 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="mb-4 opacity-90">
                Founded in 2024, M.A.C.S. began with a simple idea: make fashion accessible to everyone.
                What started as a small online boutique has grown into a global fashion destination.
              </p>
              <p className="opacity-90">
                We believe that everyone deserves to look and feel their best without breaking the bank.
                Our team works tirelessly to bring you the latest trends and timeless classics at affordable prices.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800"
                alt="Our store"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
