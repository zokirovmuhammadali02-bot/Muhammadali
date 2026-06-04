import React, { useState, useEffect, useRef } from "react";
import { Question } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { QuizState } from "../types";
import { Timer, Star, ShieldAlert, Sparkles, HelpCircle, ArrowRight, BookOpen, AlertCircle, Volume2, CheckCircle2, History } from "lucide-react";

interface QuizGameProps {
  questions: Question[];
  durationPerQuestion: number; // in seconds
  accentColor: string;
  darkTheme: boolean;
  onFinish: (score: number, wrongCount: number, skippedCount: number, userAnswers: { [key: number]: number | null }) => void;
  onQuit: () => void;
  cardOpacity: number;
}

export default function QuizGame({
  questions,
  durationPerQuestion,
  accentColor,
  darkTheme,
  onFinish,
  onQuit,
  cardOpacity,
}: QuizGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Lifelines
  const [hintUsed, setHintUsed] = useState(false);
  const [doubleTimeUsed, setDoubleTimeUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(durationPerQuestion);
  const [currentLimit, setCurrentLimit] = useState(durationPerQuestion);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | null }>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getAccentColorString = (type: "bg" | "border" | "text" | "ring") => {
    switch (accentColor) {
      case "emerald":
        return type === "bg" ? "bg-emerald-600" : type === "border" ? "border-emerald-500" : type === "text" ? "text-emerald-400" : "ring-emerald-500/20";
      case "indigo":
        return type === "bg" ? "bg-indigo-600" : type === "border" ? "border-indigo-500" : type === "text" ? "text-indigo-400" : "ring-indigo-500/20";
      case "violet":
        return type === "bg" ? "bg-violet-600" : type === "border" ? "border-violet-500" : type === "text" ? "text-violet-400" : "ring-violet-500/20";
      case "rose":
        return type === "bg" ? "bg-rose-600" : type === "border" ? "border-rose-500" : type === "text" ? "text-rose-400" : "ring-rose-500/20";
      case "amber":
        return type === "bg" ? "bg-amber-600" : type === "border" ? "border-amber-500" : type === "text" ? "text-amber-400" : "ring-amber-500/20";
      case "fuchsia":
        return type === "bg" ? "bg-fuchsia-600" : type === "border" ? "border-fuchsia-500" : type === "text" ? "text-fuchsia-400" : "ring-fuchsia-500/20";
      case "sky":
        return type === "bg" ? "bg-sky-600" : type === "border" ? "border-sky-500" : type === "text" ? "text-sky-400" : "ring-sky-500/20";
      default:
        return type === "bg" ? "bg-indigo-600" : type === "border" ? "border-indigo-500" : type === "text" ? "text-indigo-400" : "ring-indigo-500/20";
    }
  };

  const currentQuestion = questions[currentIdx];

  // Tick the timer
  useEffect(() => {
    if (isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isAnswered, currentLimit]);

  // Restart timer on new question
  useEffect(() => {
    setTimeLeft(durationPerQuestion);
    setCurrentLimit(durationPerQuestion);
    setSelectedIdx(null);
    setIsAnswered(false);
    setDisabledOptions([]);
  }, [currentIdx, durationPerQuestion]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setSelectedIdx(null);
    setSkippedCount((prev) => prev + 1);
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: null }));
  };

  const selectOption = (optIdx: number) => {
    if (isAnswered) return;
    clearInterval(timerRef.current!);
    
    setSelectedIdx(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQuestion.ans;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
    
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  // Lifeline A: Hint / 50-50 (Disables two incorrect answers)
  const useHint = () => {
    if (hintUsed || isAnswered) return;
    setHintUsed(true);
    
    const ans = currentQuestion.ans;
    const incorrectIndices = currentQuestion.opts
      .map((_, idx) => idx)
      .filter((idx) => idx !== ans);
    
    // Pick 1 random incorrect option to disable
    const randIdx = Math.floor(Math.random() * incorrectIndices.length);
    setDisabledOptions([incorrectIndices[randIdx]]);
  };

  // Lifeline B: Double Time (+15 seconds or doubles overall timer)
  const useDoubleTime = () => {
    if (doubleTimeUsed || isAnswered) return;
    setDoubleTimeUsed(true);
    setCurrentLimit((prev) => prev * 2);
    setTimeLeft((prev) => prev + durationPerQuestion);
  };

  const goToNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onFinish(score, wrongCount, skippedCount, userAnswers);
    }
  };

  const pct = (timeLeft / currentLimit) * 100;
  
  const getTimerColorClass = () => {
    if (timeLeft <= 5) return "bg-rose-500";
    if (timeLeft <= 10) return "bg-amber-500";
    return getAccentColorString("bg");
  };

  const textPrimaryClass = darkTheme ? "text-white" : "text-slate-800";
  const textSecondaryClass = darkTheme ? "text-slate-300" : "text-slate-600";
  const bgGlassClass = darkTheme ? "bg-slate-900" : "bg-white";
  const borderClass = darkTheme ? "border-slate-800" : "border-slate-100";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* HUD Bar */}
      <div 
        className="flex justify-between items-center px-4 py-3 rounded-2xl border transition-all text-sm gap-2 shrink-0 md:flex-row flex-col"
        style={{ 
          backgroundColor: `${bgGlassClass}${Math.round(cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
          backdropFilter: "blur(12px)",
          borderColor: borderClass
        }}
      >
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
            darkTheme ? "bg-slate-800 text-slate-200" : "bg-slate-50 text-slate-600"
          }`}>
            English Quiz
          </span>
          <div className={`font-medium ${textPrimaryClass}`}>
            Savol <span className="font-semibold">{currentIdx + 1}</span>/{questions.length}
          </div>
        </div>

        {/* Live status points */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className={`font-semibold ${textPrimaryClass}`}>To'g'ri: {score}</span>
          </div>
          <div className="flex items-center gap-1 text-rose-500">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-semibold">Xato: {wrongCount}</span>
          </div>
        </div>
      </div>

      {/* Main Question & Timer card */}
      <div 
        className="rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 p-5 sm:p-7 relative"
        style={{ 
          backgroundColor: `${bgGlassClass}${Math.round(cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
          backdropFilter: "blur(16px)",
          borderColor: borderClass
        }}
      >
        {/* Timer Section info */}
        <div className="flex justify-between items-center mb-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Timer className={`w-4 h-4 ${timeLeft <= 5 ? "text-rose-500 animate-pulse" : getAccentColorString("text")}`} />
            <span className={timeLeft <= 5 ? "text-rose-500 font-bold" : textSecondaryClass}>
              {timeLeft} soniya qoldi
            </span>
          </div>

          <div className={`hidden sm:block text-[11px] ${textSecondaryClass}`}>
            Vaqt tugasa, o'tkaziladi
          </div>
        </div>

        {/* Timer Bar Wrapper */}
        <div className="w-full h-1.5 bg-slate-200/50 dark:bg-slate-800/40 rounded-full overflow-hidden mb-6">
          <motion.div
            className={`h-full ${getTimerColorClass()}`}
            style={{ width: `${pct}%` }}
            initial={{ width: "100%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${getAccentColorString("text")}`}>
                Savol mazmuni
              </span>
              <h2 className={`text-base sm:text-lg md:text-xl font-medium leading-relaxed ${textPrimaryClass}`}>
                {currentQuestion.q}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 gap-3.5 mt-4">
              {currentQuestion.opts.map((opt, i) => {
                const isSelected = selectedIdx === i;
                const isCorrect = currentQuestion.ans === i;
                const isDisabled = disabledOptions.includes(i);

                let optStyle = "";
                let indicator = null;

                if (isAnswered) {
                  if (isCorrect) {
                    optStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-emerald-500/10";
                    indicator = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
                  } else if (isSelected) {
                    optStyle = "border-rose-500 bg-rose-500/15 text-rose-400 shadow-rose-500/10";
                    indicator = <AlertCircle className="w-4 h-4 text-rose-500" />;
                  } else {
                    optStyle = "border-slate-800/20 dark:border-slate-700/30 opacity-45";
                  }
                } else if (isDisabled) {
                  optStyle = "border-slate-800/10 dark:border-slate-700/10 opacity-25 cursor-not-allowed";
                } else {
                  optStyle = `${
                    darkTheme
                      ? "border-slate-700/60 bg-slate-850/60 hover:bg-slate-800/80 hover:border-slate-500"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300"
                  } cursor-pointer active:scale-99`;
                }

                return (
                  <button
                    key={i}
                    type="button"
                    id={`opt-btn-${i}`}
                    disabled={isAnswered || isDisabled}
                    onClick={() => selectOption(i)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium flex items-center justify-between transition-all outline-none ${optStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center border ${
                        isSelected 
                          ? "bg-white text-slate-800 border-transparent" 
                          : darkTheme ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-white text-slate-600 border-slate-200"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={isSelected || isCorrect ? "font-semibold" : ""}>
                        {opt}
                      </span>
                    </div>
                    {indicator}
                  </button>
                );
              })}
            </div>

            {/* Uzbek Explanations (Appears only after selection) */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex flex-col gap-2 relative mt-4 ${
                  selectedIdx === currentQuestion.ans
                    ? darkTheme ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-emerald-50/80 border-emerald-100 text-emerald-850"
                    : selectedIdx === null
                      ? darkTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50/80 border-amber-100 text-amber-850"
                      : darkTheme ? "bg-rose-500/10 border-rose-500/20 text-rose-300" : "bg-rose-50/80 border-rose-100 text-rose-850"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Kengaytirilgan o'zbekcha izoh</span>
                </div>
                {selectedIdx === null && (
                  <p className="text-xs font-bold text-rose-500 mb-1">
                    [TUGADI] Belgilashga ulgura olmadingiz! To'g'ri javob: {String.fromCharCode(65 + currentQuestion.ans)}.
                  </p>
                )}
                <p className="text-xs sm:text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lifelines Bottom rail and Controls */}
      <div className="flex gap-3 justify-between items-center sm:flex-row flex-col-reverse">
        {/* Lifelines buttons */}
        <div className="flex gap-2.5">
          <button
            type="button"
            id="lifeline-hint"
            disabled={hintUsed || isAnswered}
            onClick={useHint}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
              hintUsed
                ? "bg-slate-300/10 border-transparent text-slate-500 opacity-40 cursor-not-allowed"
                : isAnswered
                  ? "bg-slate-400/5 text-slate-500 border-transparent opacity-40 cursor-not-allowed"
                  : darkTheme 
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500" 
                    : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Noto'g'rini o'chirish (50:50)</span>
          </button>

          <button
            type="button"
            id="lifeline-time"
            disabled={doubleTimeUsed || isAnswered}
            onClick={useDoubleTime}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
              doubleTimeUsed
                ? "bg-slate-300/10 border-transparent text-slate-500 opacity-40 cursor-not-allowed"
                : isAnswered
                  ? "bg-slate-400/5 text-slate-500 border-transparent opacity-40 cursor-not-allowed"
                  : darkTheme 
                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500" 
                    : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300"
            }`}
          >
            <Timer className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Vaqtni oshirish (2x)</span>
          </button>
        </div>

        {/* Quit vs Continue */}
        <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            id="quit-quiz"
            onClick={onQuit}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
              darkTheme
                ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                : "border-slate-200 hover:bg-slate-100 text-slate-600"
            }`}
          >
            Chiqish
          </button>

          {isAnswered ? (
            <button
              type="button"
              id="next-question"
              onClick={goToNext}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg cursor-pointer transform hover:scale-101 active:scale-98 transition ${getAccentColorString("bg")} hover:brightness-110`}
            >
              <span>{currentIdx + 1 === questions.length ? "Natijalar" : "Keyingi savol"}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              id="skip-question"
              onClick={handleTimeout}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs border cursor-pointer hover:bg-slate-500/10 transition ${
                darkTheme ? "border-slate-850 text-slate-400" : "border-slate-200 text-slate-500"
              }`}
            >
              Savolni o'tkazish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
