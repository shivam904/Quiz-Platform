import { useState, useEffect } from 'react';
import { getAttempts, getQuiz } from '../utils/db';

function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        setLoading(true);
        const attemptsData = await getAttempts();
        
        // Fetch quiz details for each attempt
        const attemptsWithQuizDetails = await Promise.all(
          attemptsData.map(async (attempt) => {
            const quiz = await getQuiz(attempt.quizId);
            return {
              ...attempt,
              quizTitle: quiz ? quiz.title : 'Unknown Quiz'
            };
          })
        );

        setAttempts(attemptsWithQuizDetails);
      } catch (error) {
        console.error('Error loading attempts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAttempts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Error loading attempt history: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
      {attempts.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No attempts yet. Try taking a quiz!
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.quizTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.score}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;