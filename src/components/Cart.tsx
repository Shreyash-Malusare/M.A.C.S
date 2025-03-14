import { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { cartApi } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState( true);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!user) {
          setItems([]);
          setLoading(false);
          return;
        }
        
        const data = await cartApi.getCart(user._id);
        setItems(data);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) loadCart();
  }, [isOpen, user]); // Add user to dependencies

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      if (!user) return;
      
      const updatedItem = await cartApi.updateCartItem(id, quantity, user._id);
      setItems(items.map(item => 
        item._id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      if (!user) return;
      
      await cartApi.removeCartItem(id, user._id);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-white">
            <ShoppingBag /> Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={24} className="dark:text-white" />
          </button>
        </div>
        
        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="dark:text-white">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <ShoppingBag size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img src={item.productId.image} alt={item.productId.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium dark:text-white">{item.productId.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">${item.productId.price}</p>
                    <p className="text-gray-600 dark:text-gray-300">Size: {item.size}</p> {/* Display size */}
                    <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} className="dark:text-white" />
                    </button> 
                      <span className="w-8 text-center dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <Plus size={16} className="dark:text-white" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="ml-auto text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-between mb-4">
            <span className="font-semibold dark:text-white">Total:</span>
            <span className="font-semibold dark:text-white">
            ₹{total.toFixed(2)}
            </span>
          </div>
          <Link to="/checkout"onClick={() => {onClose();}}>
          <button
            className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
            disabled={items.length === 0}
          >
            Checkout
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}