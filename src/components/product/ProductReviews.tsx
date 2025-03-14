import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { submitReview, Review } from '../../api/reviews';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onReviewSubmitted: () => void;
}

export function ProductReviews({ productId, reviews, onReviewSubmitted }: ProductReviewsProps) {
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme(); // Get theme state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to review');
    if (user.role === 'admin') return alert('Admins cannot submit reviews.'); // Block admins

    setIsSubmitting(true);
    try {
      await submitReview(productId, user._id, newReview.rating, newReview.comment);
      onReviewSubmitted(); // This should trigger parent component to refresh reviews
      setNewReview({ rating: 0, comment: '' }); // Reset form state
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleHelpful = async (reviewId: string) => {
  //   try {
  //     await markReviewHelpful(reviewId);
  //     onReviewSubmitted(); // Refresh reviews to update helpful count
  //   } catch (error) {
  //     console.error('Error marking review as helpful:', error);
  //   }
  // };

  // Theme-based styles
  const formStyles = isDarkMode
    ? 'bg-gray-800 text-white'
    : 'bg-gray-100 text-gray-900';

  const reviewItemStyles = isDarkMode
    ? 'border-gray-700 text-gray-300'
    : 'border-b text-gray-600';

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : ''}`}>
        Customer Reviews
      </h2>

      {/* Review Form */}
      {user && user.role !== 'admin' && ( // Only show form for non-admin users
        <form onSubmit={handleSubmit} className={`${formStyles} p-4 rounded-lg`}>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                type="button"
                key={rating}
                onClick={() => setNewReview((p) => ({ ...p, rating }))}
                className={`p-1 ${newReview.rating >= rating ? 'text-yellow-400' : isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}
              >
                <Star fill={newReview.rating >= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview((p) => ({ ...p, comment: e.target.value }))}
            className={`w-full p-2 rounded mb-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'border'}`}
            placeholder="Write your review..."
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newReview.rating || !newReview.comment}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Message for Admins */}
      {user?.role === 'admin' && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <p>Admins cannot submit reviews.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className={`pb-6 ${reviewItemStyles}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>
                  {review.user.name}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-yellow-400 fill-current' : isDarkMode ? 'text-gray-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {review.date}
                  </span>
                </div>
              </div>
              {/* <button
                onClick={() => handleHelpful(review._id)}
                className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
              >
                <ThumbsUp size={16} />
                <span>{review.helpful}</span>
              </button> */}
            </div>
            <p className={isDarkMode ? 'text-gray-300' : ''}>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}