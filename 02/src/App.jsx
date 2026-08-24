import { useCallback, useEffect, useState } from 'react';
import EdgeAmbience from './components/EdgeAmbience';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';

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
      const source = Array.isArray(parsed) ? parsed : parsed.questions;

      if (!Array.isArray(source) || source.length === 0) {
        throw new Error('JSON dosyasında en az bir sorudan oluşan bir dizi bulunmalı.');
      }

      const normalized = source.map((item, index) => {
        const question = item.question ?? item.soru ?? item.text;
        const options = item.options ?? item.secenekler ?? item.choices;
        const answerValue = item.answer ?? item.correctAnswer ?? item.dogruCevap;

        if (typeof question !== 'string' || !question.trim()) {
          throw new Error(`${index + 1}. sorunun metni eksik.`);
        }
        if (!Array.isArray(options) || options.length < 2 || options.some((option) => typeof option !== 'string')) {
          throw new Error(`${index + 1}. soruda en az iki metin seçeneği bulunmalı.`);
        }

        let answer = answerValue;
        if (typeof answerValue === 'string') {
          const letterIndex = /^[A-Z]$/i.test(answerValue)
            ? answerValue.toUpperCase().charCodeAt(0) - 65
            : -1;
          answer = letterIndex >= 0 ? letterIndex : options.indexOf(answerValue);
        }

        if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
          throw new Error(`${index + 1}. sorunun doğru cevap değeri geçersiz.`);
        }

        return {
          id: item.id ?? index + 1,
          category: item.category ?? item.kategori ?? 'Quiz',
          question: question.trim(),
          options,
          answer,
          explanation: item.explanation ?? item.aciklama ?? '',
        };
      });

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
