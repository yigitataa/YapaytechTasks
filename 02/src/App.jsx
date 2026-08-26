import { useCallback, useEffect, useMemo, useState } from 'react';
import EdgeAmbience from './components/EdgeAmbience';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultScreen from './components/ResultScreen';
import { normalizeQuestions } from './utils/normalizeQuestions';

const QUESTION_DURATION = 30;
const STORAGE_KEY = 'yataquizing:state:v2';

const builtinModules = import.meta.glob('../questions/quiz_*.json', {
  eager: true,
  import: 'default',
});

const BUILTIN_QUIZZES = Object.entries(builtinModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([path, data]) => {
    const fileName = path.split('/').pop();
    const number = fileName.match(/\d+/)?.[0] ?? '';

    return {
      id: `builtin:${fileName}`,
      name: `Quiz ${number}`,
      fileName,
      source: 'builtin',
      questions: normalizeQuestions(data),
    };
  });

function blankProgress(questionCount) {
  return {
    questionIndex: 0,
    answers: Array(questionCount).fill(null),
    deadlines: Array(questionCount).fill(null),
  };
}

function remainingSeconds(deadline) {
  if (!deadline) return QUESTION_DURATION;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

function readInitialState() {
  const fallbackQuiz = BUILTIN_QUIZZES[0] ?? null;
  const fallback = {
    uploadedQuizzes: [],
    activeQuizId: fallbackQuiz?.id ?? null,
    questions: fallbackQuiz?.questions ?? [],
    screen: 'start',
    ...blankProgress(fallbackQuiz?.questions.length ?? 0),
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!stored) return fallback;

    const uploadedQuizzes = Array.isArray(stored.uploadedQuizzes)
      ? stored.uploadedQuizzes.map((quiz) => ({
        ...quiz,
        source: 'upload',
        questions: normalizeQuestions(quiz.questions),
      }))
      : [];
    const catalog = [...BUILTIN_QUIZZES, ...uploadedQuizzes];
    const session = stored.session ?? {};
    const activeQuiz = catalog.find((quiz) => quiz.id === session.quizId) ?? fallbackQuiz;

    if (!activeQuiz) return { ...fallback, uploadedQuizzes };

    const questionCount = activeQuiz.questions.length;
    const questionIndex = Math.min(
      Math.max(Number(session.questionIndex) || 0, 0),
      Math.max(questionCount - 1, 0),
    );
    const answers = Array.from({ length: questionCount }, (_, index) => (
      Number.isInteger(session.answers?.[index]) ? session.answers[index] : null
    ));
    const deadlines = Array.from({ length: questionCount }, (_, index) => (
      Number.isFinite(session.deadlines?.[index]) ? session.deadlines[index] : null
    ));
    const screen = ['start', 'quiz', 'result'].includes(session.screen)
      ? session.screen
      : 'start';

    return {
      uploadedQuizzes,
      activeQuizId: activeQuiz.id,
      questions: activeQuiz.questions,
      screen,
      questionIndex,
      answers,
      deadlines,
    };
  } catch {
    return fallback;
  }
}

export default function App() {
  const [initialState] = useState(readInitialState);
  const [screen, setScreen] = useState(initialState.screen);
  const [uploadedQuizzes, setUploadedQuizzes] = useState(initialState.uploadedQuizzes);
  const [activeQuizId, setActiveQuizId] = useState(initialState.activeQuizId);
  const [questions, setQuestions] = useState(initialState.questions);
  const [fileError, setFileError] = useState('');
  const [questionIndex, setQuestionIndex] = useState(initialState.questionIndex);
  const [answers, setAnswers] = useState(initialState.answers);
  const [deadlines, setDeadlines] = useState(initialState.deadlines);
  const [timeLeft, setTimeLeft] = useState(
    remainingSeconds(initialState.deadlines[initialState.questionIndex]),
  );

  const availableQuizzes = useMemo(
    () => [...BUILTIN_QUIZZES, ...uploadedQuizzes],
    [uploadedQuizzes],
  );
  const activeQuiz = availableQuizzes.find((quiz) => quiz.id === activeQuizId);
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const hasProgress = deadlines.some(Boolean) || answeredCount > 0 || questionIndex > 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      uploadedQuizzes,
      session: activeQuizId ? {
        quizId: activeQuizId,
        screen,
        questionIndex,
        answers,
        deadlines,
      } : null,
    }));
  }, [uploadedQuizzes, activeQuizId, screen, questionIndex, answers, deadlines]);

  const activateQuestion = useCallback((index) => {
    const now = Date.now();
    setQuestionIndex(index);
    setDeadlines((current) => {
      const next = [...current];
      const deadline = next[index] ?? now + (QUESTION_DURATION * 1000);
      next[index] = deadline;
      setTimeLeft(remainingSeconds(deadline));
      return next;
    });
  }, []);

  const restartQuiz = useCallback(() => {
    if (!questions.length) return;

    const nextDeadlines = Array(questions.length).fill(null);
    nextDeadlines[0] = Date.now() + (QUESTION_DURATION * 1000);
    setQuestionIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setDeadlines(nextDeadlines);
    setTimeLeft(QUESTION_DURATION);
    setScreen('quiz');
  }, [questions.length]);

  const startOrResumeQuiz = useCallback(() => {
    if (!questions.length) return;
    if (!hasProgress) {
      restartQuiz();
      return;
    }

    setScreen('quiz');
    activateQuestion(questionIndex);
  }, [questions.length, hasProgress, restartQuiz, activateQuestion, questionIndex]);

  const finishOrAdvance = useCallback(() => {
    if (questionIndex >= questions.length - 1) {
      setScreen('result');
      return;
    }
    activateQuestion(questionIndex + 1);
  }, [questionIndex, questions.length, activateQuestion]);

  useEffect(() => {
    if (screen !== 'quiz') return undefined;

    const deadline = deadlines[questionIndex];
    if (!deadline) {
      activateQuestion(questionIndex);
      return undefined;
    }

    let expirationHandled = false;
    const updateTimer = () => {
      const remaining = remainingSeconds(deadline);
      setTimeLeft(remaining);
      if (remaining <= 0 && !expirationHandled) {
        expirationHandled = true;
        finishOrAdvance();
      }
    };

    updateTimer();
    const timerId = window.setInterval(updateTimer, 250);
    return () => window.clearInterval(timerId);
  }, [screen, questionIndex, deadlines, activateQuestion, finishOrAdvance]);

  function chooseAnswer(optionIndex) {
    setAnswers((current) => current.map((answer, index) => (
      index === questionIndex ? optionIndex : answer
    )));
  }

  function goPrevious() {
    if (questionIndex === 0) return;
    activateQuestion(questionIndex - 1);
  }

  function goHome() {
    setScreen('start');
  }

  function selectQuiz(quizId) {
    const selected = availableQuizzes.find((quiz) => quiz.id === quizId);
    if (!selected || selected.id === activeQuizId) return;

    const progress = blankProgress(selected.questions.length);
    setActiveQuizId(selected.id);
    setQuestions(selected.questions);
    setQuestionIndex(progress.questionIndex);
    setAnswers(progress.answers);
    setDeadlines(progress.deadlines);
    setTimeLeft(QUESTION_DURATION);
    setFileError('');
    setScreen('start');
  }

  async function loadQuestions(file) {
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const normalized = normalizeQuestions(parsed);
      const id = `upload:${file.name.toLocaleLowerCase('tr-TR')}`;
      const uploadedQuiz = {
        id,
        name: file.name.replace(/\.json$/i, ''),
        fileName: file.name,
        source: 'upload',
        questions: normalized,
      };

      setUploadedQuizzes((current) => [
        ...current.filter((quiz) => quiz.id !== id),
        uploadedQuiz,
      ]);
      setActiveQuizId(id);
      setQuestions(normalized);
      setQuestionIndex(0);
      setAnswers(Array(normalized.length).fill(null));
      setDeadlines(Array(normalized.length).fill(null));
      setTimeLeft(QUESTION_DURATION);
      setFileError('');
      setScreen('start');
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'JSON dosyası okunamadı.');
    }
  }

  return (
    <div className="app-shell">
      <EdgeAmbience />
      {screen === 'start' && (
        <StartScreen
          quizzes={availableQuizzes}
          activeQuizId={activeQuizId}
          selectedQuizName={activeQuiz?.name}
          questionCount={questions.length}
          answeredCount={answeredCount}
          hasProgress={hasProgress}
          error={fileError}
          onSelectQuiz={selectQuiz}
          onFileSelect={loadQuestions}
          onStart={startOrResumeQuiz}
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
          onRestart={restartQuiz}
          onHome={goHome}
        />
      )}
    </div>
  );
}
