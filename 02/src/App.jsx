import { useCallback, useEffect, useState } from 'react';
import EdgeAmbience from './components/EdgeAmbience';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import { normalizeQuestions } from './utils/normalizeQuestions';

const QUESTION_DURATION = 30;

export default function App() {
  const [screen, setScreen] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);

  const resetQuiz = useCallback(() => {
    setQuestionIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setTimeLeft(QUESTION_DURATION);
    setScreen('quiz');
  }, [questions.length]);

  const finishOrAdvance = useCallback(() => {
    if (questionIndex >= questions.length - 1) {
      setScreen('result');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setTimeLeft(QUESTION_DURATION);
  }, [questionIndex, questions.length]);

  useEffect(() => {
    if (screen !== 'quiz') return undefined;
    if (timeLeft <= 0) {
      finishOrAdvance();
      return undefined;
    }

    const timerId = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [screen, timeLeft, finishOrAdvance]);

  function chooseAnswer(optionIndex) {
    setAnswers((current) => current.map((answer, index) => (
      index === questionIndex ? optionIndex : answer
    )));
  }

  function goPrevious() {
    if (questionIndex === 0) return;
    setQuestionIndex((current) => current - 1);
    setTimeLeft(QUESTION_DURATION);
  }

  function goHome() {
    setScreen('start');
    setQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(QUESTION_DURATION);
  }

  async function loadQuestions(file) {
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const normalized = normalizeQuestions(parsed);

      setQuestions(normalized);
      setFileName(file.name);
      setFileError('');
    } catch (error) {
      setQuestions([]);
      setFileName('');
      setFileError(error instanceof Error ? error.message : 'JSON dosyası okunamadı.');
    }
  }

  return (
    <div className="app-shell">
      <EdgeAmbience />
      {screen === 'start' && (
        <StartScreen
          fileName={fileName}
          questionCount={questions.length}
          error={fileError}
          onFileSelect={loadQuestions}
          onStart={resetQuiz}
        />
      )}
      {screen === 'quiz' && questions[questionIndex] && (
        <QuestionScreen
          key={questions[questionIndex].id ?? questionIndex}
          question={questions[questionIndex]}
          index={questionIndex}
          total={questions.length}
          answer={answers[questionIndex]}
          answers={answers}
          timeLeft={timeLeft}
          duration={QUESTION_DURATION}
          onAnswer={chooseAnswer}
          onPrevious={goPrevious}
          onNext={finishOrAdvance}
          onExit={goHome}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          questions={questions}
          answers={answers}
          onRestart={resetQuiz}
          onHome={goHome}
        />
      )}
    </div>
  );
}
