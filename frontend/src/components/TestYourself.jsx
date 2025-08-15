import { useState, useEffect } from 'react';
import '../styles/TestYourself.css';

export default function TestYourself() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizzes, setQuizzes] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const toggleCard = (cardKey) => {
    setExpandedCard(prev => (prev === cardKey ? null : cardKey));
  };

  const handleAnswerSelect = (cardKey, questionId, answerId) => {
    if (answers[questionId]) return;

    const question = quizzes[cardKey].questions.find(q => q.id === questionId);
    const selectedOption = question.options.find(opt => opt.id === answerId);
    const isCorrect = selectedOption.isCorrect;

    setAnswers(prev => ({
      ...prev,
      [questionId]: { selectedAnswerId: answerId, isCorrect }
    }));
  };

  const resetQuiz = (cardKey) => {
    const questionIds = quizzes[cardKey].questions.map(q => q.id);
    const newAnswers = { ...answers };
    questionIds.forEach(id => delete newAnswers[id]);
    setAnswers(newAnswers);
  };

  const isQuizComplete = (cardKey) =>
    quizzes[cardKey].questions.every(q => answers[q.id]);

  return (
    <div className="quiz-container">
      <h1 className="page-title">Test Yourself</h1>
      <p className="page-subtitle">
        Challenge your understanding of physics with these interactive quizzes
      </p>

      {Object.keys(quizzes).map((quizKey) => {
        const quiz = quizzes[quizKey];
        const isExpanded = expandedCard === quizKey;
        const isCompleted = isQuizComplete(quizKey);

        return (
          <div key={quizKey} className="quiz-card">
            <div className={`quiz-card-header ${quiz.className}`}></div>
            <div className="quiz-card-content">
              <h2 className="quiz-card-title">{quiz.title}</h2>
              <p className="quiz-card-description">{quiz.description}</p>

              {!isExpanded && (
                <button
                  onClick={() => toggleCard(quizKey)}
                  className={`quiz-button ${quiz.className}`}
                >
                  Start Quiz
                </button>
              )}

              {isExpanded && (
                <div>
                  {isCompleted && (
                    <button onClick={() => resetQuiz(quizKey)} className="retry-button">
                      Try Again
                    </button>
                  )}

                  {quiz.questions.map((question, qIndex) => {
                    const answered = answers[question.id];
                    return (
                      <div key={question.id} className="question-container">
                        <div className="question-text">
                          {qIndex + 1}. {question.text}
                        </div>
                        <div>
                          {question.options.map((option) => {
                            const isSelected = answered && answered.selectedAnswerId === option.id;
                            const showCorrect = answered && option.isCorrect;
                            const showIncorrect = isSelected && !option.isCorrect;

                            let optionClass = "option";
                            if (showCorrect) optionClass += " correct";
                            if (showIncorrect) optionClass += " incorrect";
                            if (isSelected && !showIncorrect && !showCorrect) optionClass += " selected";

                            return (
                              <div
                                key={option.id}
                                onClick={() => handleAnswerSelect(quizKey, question.id, option.id)}
                                className={optionClass}
                              >
                                {option.text}
                              </div>
                            );
                          })}
                        </div>
                        {answered && !answered.isCorrect && (
                          <div className="correct-answer">
                            Correct answer: {question.options.find(o => o.isCorrect).text}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button onClick={() => toggleCard(quizKey)} className="close-button">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}