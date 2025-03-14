import { useTheme } from '../../context/ThemeContext'; // Adjust the import path as needed

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isDarkMode 
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:hover:bg-gray-800' 
            : 'border-gray-300 text-gray-900 hover:bg-gray-100'
        }`}
      >
        Previous
      </button>
      
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-md transition-colors ${
              currentPage === page
                ? isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-black text-white' 
                : isDarkMode 
                  ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isDarkMode 
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700 disabled:hover:bg-gray-800' 
            : 'border-gray-300 text-gray-900 hover:bg-gray-100'
        }`}
      >
        Next
      </button>
    </div>
  );
}
