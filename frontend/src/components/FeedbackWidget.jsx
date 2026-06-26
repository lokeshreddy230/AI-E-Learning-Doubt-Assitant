import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const FeedbackWidget = ({ doubtId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!doubtId) return null; // Don't render if doubtId isn't available yet

  const handleSubmit = async (selectedRating) => {
    setRating(selectedRating);
    setIsSubmitting(true);
    try {
      await api.post(`/doubts/${doubtId}/feedback`, {
        rating: selectedRating,
        comments: 'Rated from UI'
      });
      setIsSubmitted(true);
      toast.success('Thanks for your feedback!');
    } catch (error) {
      if (error.response?.data?.detail === 'Feedback already submitted for this doubt') {
        setIsSubmitted(true);
        toast.success('You have already rated this explanation.');
      } else {
        toast.error('Failed to submit feedback.');
        setRating(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800/30 w-fit">
        <CheckCircle className="w-4 h-4" />
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Rate this explanation:</span>
      <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={isSubmitting}
            onMouseEnter={() => setHoveredRating(star)}
            onClick={() => handleSubmit(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedbackWidget;
