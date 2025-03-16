// src/pages/dashboard/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { PlusSquare, Edit3, Trash2, Search, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, createProduct, deleteProduct, updateProduct } from '../../api/products';

export const Products = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Reset form function
  const resetForm = () => {
    setNewProduct({
      name: '',
      price: '',
      category: 'men',
      description: '',
      isNew: false,
      image: '',
    });
  };
  // Updated "Add Product" button handler
  const handleAddProductClick = () => {
    resetForm(); // Reset the form fields
    setEditingProduct(null); // Clear any editing state
    setShowAddForm(true); // Show the form
  };
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'men',
    description: '',
    isNew: false,
    image: '', // Now a string
  });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchQuery]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(
          'all',
          searchQuery,
          [0, 50000],
          '',
          pagination.page,
          pagination.limit
        );
        setProducts(data.products);
        setPagination(prev => ({
          ...prev,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        }));
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again.');
      }
    };

    const debounceTimer = setTimeout(loadProducts, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, pagination.page, pagination.limit]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
        throw new Error('All fields including image URL are required.');
      }

      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        isNew: newProduct.isNew
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }

      setShowAddForm(false);
      setEditingProduct(null);
      const data = await fetchProducts('all', searchQuery, [0, 10000], '', 1, pagination.limit);
      setProducts(data.products);
      setPagination(prev => ({ ...prev, page: 1, totalPages: data.totalPages }));
    } catch (error) {
      console.error('Failed to save product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      if (products.length === 1 && pagination.page > 1) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const setupEditForm = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      isNew: product.isNew,
      image: product.image,
    });
    setShowAddForm(true);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search and Add Product */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search all products..."
            className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 w-full transition-colors duration-300 ${isDarkMode
              ? 'bg-gray-800 text-white focus:ring-white border-gray-700'
              : 'bg-white text-gray-900 focus:ring-black border-gray-200'
              }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          onClick={handleAddProductClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
            ? 'bg-white text-black hover:bg-gray-100'
            : 'bg-black text-white hover:bg-gray-800'
            }`}
        >
          <PlusSquare size={20} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className={`rounded-lg shadow-sm overflow-x-auto transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            <tr className={`text-left border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">New</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                {/* Mobile View */}
                <td className="md:hidden p-4">
                  <div className="flex flex-col gap-2">
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      {product.name}
                    </div>
                    <div className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      ₹{product.price}
                    </div>
                    <div className={`capitalize text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {product.category}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.isNew
                        ? 'bg-blue-100 text-blue-800'
                        : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                        }`}>
                        {product.isNew ? 'New' : 'Existing'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setupEditForm(product)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Desktop View */}
                <td className={`hidden md:table-cell p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </td>
                <td className={`hidden md:table-cell p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ₹{product.price}
                </td>
                <td className={`hidden md:table-cell p-4 capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {product.category}
                </td>
                <td className="hidden md:table-cell p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.isNew
                    ? 'bg-blue-100 text-blue-800'
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                    }`}>
                    {product.isNew ? 'New' : 'Existing'}
                  </span>
                </td>
                <td className="hidden md:table-cell p-4">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => setupEditForm(product)}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50'
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
                className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}

              {/* Image URL Input */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Image URL
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    className={`mt-1 block w-full rounded border ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-white'
                      : 'border-gray-300 focus:border-black'
                      } px-3 py-2 focus:ring-0`}
                    required
                  />
                </label>
                {newProduct.image && (
                  <img
                    src={newProduct.image}
                    alt="Preview"
                    className="mt-2 h-32 w-full object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* Name Input */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Product Name
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className={`mt-1 block w-full rounded border ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-white'
                      : 'border-gray-300 focus:border-black'
                      } px-3 py-2 focus:ring-0`}
                    required
                  />
                </label>
              </div>

              {/* Price Input */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Price
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    className={`mt-1 block w-full rounded border ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-white'
                      : 'border-gray-300 focus:border-black'
                      } px-3 py-2 focus:ring-0`}
                    step="1"
                    required
                  />
                </label>
              </div>

              {/* Category Input */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Category
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className={`mt-1 block w-full rounded border ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-white'
                      : 'border-gray-300 focus:border-black'
                      } px-3 py-2 focus:ring-0`}
                    required
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="accessories">Accessories</option>
                    <option value="unisex">Unisex</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </label>
              </div>

              {/* Description Input */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Description
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className={`mt-1 block w-full rounded border ${isDarkMode
                      ? 'bg-gray-700 border-gray-600 focus:border-white'
                      : 'border-gray-300 focus:border-black'
                      } px-3 py-2 focus:ring-0`}
                    rows={4}
                  />
                </label>
              </div>

              {/* Is New Product Toggle */}
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProduct.isNew}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, isNew: e.target.checked }))}
                  className={`rounded border ${isDarkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-white'
                    : 'border-gray-300 focus:border-black'
                    }`}
                  id="isNew"
                />
                <label
                  htmlFor="isNew"
                  className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                  Mark as New Product
                </label>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg transition-colors duration-300 ${isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
