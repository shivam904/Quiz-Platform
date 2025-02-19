import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllQuizzes } from '../utils/db';
import QuizCard from '../components/QuizCard';

function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    loadQuizzes();
  }, [location]); // Reload when location changes (i.e., after creating a quiz)

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getAllQuizzes();
      console.log('Loaded quizzes in Home:', data);
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Error loading quizzes: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Available Quizzes
        </h1>
        <Link 
          to="/create" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
        >
          ✨ Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No quizzes yet!</h2>
          <p className="text-gray-600">Be the first one to create an awesome quiz!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;