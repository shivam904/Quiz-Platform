import { Link } from 'react-router-dom';

function QuizCard({ quiz }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 p-6 border border-purple-100">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          {quiz.title}
        </h2>
        <p className="text-gray-600 mb-4 flex-grow">
          {quiz.description || 'No description provided'}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium px-3 py-1 bg-purple-100 text-purple-600 rounded-full">
            {quiz.questions.length} questions
          </span>
          <Link 
            to={`/quiz/${quiz.id}`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Take Quiz ➜
          </Link>
        </div>
        <div className="text-xs text-gray-400 mt-4">
          Created {new Date(quiz.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default QuizCard;