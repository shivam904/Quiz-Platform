import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { saveQuiz } from '../utils/db';

function CreateQuiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    questions: [
      {
        id: uuidv4(),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: 30
      }
    ]
  });

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, {
        id: uuidv4(),
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: 30
      }]
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuiz(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        [field]: value
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuiz(prev => {
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = value;
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      id: uuidv4(),
      ...quiz,
      createdAt: new Date().toISOString()
    };

    try {
      console.log('Saving quiz data:', quizData);
      await saveQuiz(quizData);
      console.log('Quiz saved successfully');
      alert('Quiz created successfully!');
      // Force a reload of the home page
      navigate('/', { replace: true, state: { refresh: true } });
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz: ' + error.message);
    }
  };


  return (
    
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Create New Quiz ✨
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
    
              {quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="p-6 bg-purple-50 rounded-xl mb-6">
                  <h3 className="font-medium text-lg mb-4 text-purple-700">
                    Question {qIndex + 1}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Enter your question"
                      required
                    />
    
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
    
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-6 py-2 bg-purple-100 text-purple-600 rounded-full font-medium hover:bg-purple-200 transition-colors"
                >
                  + Add Question
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Create Quiz ✨
                </button>
              </div>
            </div>
          </form>
        </div>
      
  );
}

export default CreateQuiz;