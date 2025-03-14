import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { cartApi } from '../../api/cart';
import { CartItem } from '../../types';
import { Link } from 'react-router-dom';

const VITE_FRONT_END_IP = import.meta.env.VITE_FRONT_END_IP;

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [address, setAddress] = useState(''); // Address state

  const total = items.reduce((sum: number, item: CartItem) => {
    const price = Number(item.productId.price);
    const quantity = Number(item.quantity);
    return sum + price * quantity;
  }, 0);
  const amount = Number(total);

  const loadCart = async () => {
    try {
      if (!user) return;
      const data = await cartApi.getCart(user._id);
      setItems(data);
    } catch (error) {
      console.error('Error loading cart:', error);
      alert('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      alert('Payment system failed to load. Please refresh the page.');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCreateOrder = async (paymentId: string) => {
    if (!user || items.length === 0 || !address) {
      alert('Please enter a valid shipping address.');
      return;
    }

    try {
      await axios.post(`${VITE_FRONT_END_IP}:3001/api/orders`, {
        userId: user._id,
        items: items.map((item) => ({
          product: item.productId._id,
          quantity: item.quantity,
          size: item.size,
          price: item.productId.price,
        })),
        total,
        paymentId,
        status: 'completed',
        paymentStatus: 'completed',
        address, // Include the address
      });

      await cartApi.clearCart(user._id);
      setItems([]);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded || !user || processingPayment || !address) return;

    try {
      setProcessingPayment(true);
      const amountInPaise = amount * 100;

      const { data } = await axios.post(`${VITE_FRONT_END_IP}:3001/api/payment`, {
        amount: amountInPaise,
        currency: 'INR',
      });

      const options = {
        key: 'rzp_test_N3jC32a8r0tZsU',
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: 'M.A.C.S Clothing',
        description: `Order for ${user.name}`,
        handler: async (response: RazorpayResponse) => {
          await handleCreateOrder(response.razorpay_payment_id);
          window.location.href = '/dashboard';
        },
        prefill: {
          name: user.name || 'Customer',
          email: user.email || 'customer@example.com',
          contact: user.phone || '9999999999',
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: () => setProcessingPayment(false),
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Payment initialization failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <Link to="/login" className="btn-primary">
          Login to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Checkout Summary</h2>

      {loading ? (
        <div className="text-center text-lg text-gray-600 dark:text-gray-300">Loading cart items...</div>
      ) : items.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Your cart is empty</p>
          <Link to="/" className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item._id} className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{item.productId.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">₹{item.productId.price.toFixed(2)}</p>
                  <p className="text-gray-600 dark:text-gray-300">Size: {item.size}</p>
                  <p className="text-gray-600 dark:text-gray-300">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label htmlFor="address" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shipping Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              placeholder="Enter your shipping address"
              required
            />
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-2xl font-semibold text-gray-800 dark:text-white">Total:</span>
            <span className="text-2xl font-semibold text-gray-800 dark:text-white">₹{total}</span>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-6 py-3 bg-green-500 text-white text-xl font-bold rounded hover:bg-green-600 transition disabled:opacity-50"
            disabled={!razorpayLoaded || items.length === 0 || processingPayment || !address}
          >
            {processingPayment ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </>
      )}
    </div>
  );
};