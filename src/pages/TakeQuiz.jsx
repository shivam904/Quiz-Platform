import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, saveAttempt } from '../utils/db';
import Timer from '../components/Timer';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await getQuiz(id);
        setQuiz(quizData);
      } catch (error) {
        console.error('Error loading quiz:', error);
      }
    };

    loadQuiz();
  }, [id]);

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleTimeUp = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const score = calculateScore();
    const attempt = {
      quizId: quiz.id,
      answers,
      score,
      timestamp: new Date().toISOString()
    };

    try {
      await saveAttempt(attempt);
      setShowResults(true);
    } catch (error) {
      console.error('Error saving attempt:', error);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quiz.questions.length) * 100;
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl mb-4">Your score: {calculateScore()}%</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h2>
          <Timer 
            duration={question.timeLimit} 
            onTimeUp={handleTimeUp}
          />
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">{question.text}</p>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                className={`w-full p-3 text-left rounded-md border ${
                  answers[question.id] === index 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
            className="btn btn-primary disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentQuestion < quiz.questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
              } else {
                submitQuiz();
              }
            }}
            className="btn btn-primary"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;