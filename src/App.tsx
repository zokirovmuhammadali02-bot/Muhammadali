import React, { useState, useEffect } from "react";
import { Question, BackgroundConfig, ThemeConfig, HistoricalAttempt } from "./types";
import { CURATED_QUESTIONS, getRandomQuestions } from "./data";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ThemeCustomizer, { PRESET_THEMES } from "./components/ThemeCustomizer";
import QuizGame from "./components/QuizGame";
import ReviewModal from "./components/ReviewModal";
import { 
  Trophy, 
  Play, 
  Sparkles, 
  History, 
  BookOpen, 
  Timer, 
  Layers, 
  Info, 
  User, 
  Trash2, 
  Compass, 
  Activity,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Palette
} from "lucide-react";

export default function App() {
  // Global configuration states
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>({
    type: "gradient",
    colorStart: "#f8fafc",
    colorEnd: "#e2e8f0",
    direction: "to-b",
    blur: 30,
    showGrid: true,
    showParticles: false,
    cardOpacity: 95,
    blendMode: "normal",
  });

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    accentColor: "indigo",
    glassStyle: "sleek",
    darkTheme: false,
  });

  // Quiz launcher settings
  const [level, setLevel] = useState<"Elementary" | "Intermediate" | "Advanced" | "Aralash">("Aralash");
  const [category, setCategory] = useState<"Grammar" | "Vocabulary" | "Aralash">("Aralash");
  const [duration, setDuration] = useState<number>(20); // 20s default
  const [questionsCount, setQuestionsCount] = useState<number>(15);

  // AI custom prompt
  const [aiTopic, setAiTopic] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStep, setAiStep] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);

  // Active game session state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  
  // Game results state
  const [finalScore, setFinalScore] = useState(0);
  const [finalWrong, setFinalWrong] = useState(0);
  const [finalSkipped, setFinalSkipped] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | null }>({});
  
  // Modals / Overlays
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"quiz" | "settings" | "history">("quiz");

  // Local storage attempts history
  const [attempts, setAttempts] = useState<HistoricalAttempt[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    overallAccuracy: 0,
  });

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("english_quiz_attempts_v2");
      const savedBg = localStorage.getItem("bg_config_v2");
      const savedTheme = localStorage.getItem("theme_config_v2");

      if (saved) {
        const parsed = JSON.parse(saved);
        setAttempts(parsed);
        calculateStats(parsed);
      }
      
      // Load colors if saved previously
      if (savedBg) setBgConfig(JSON.parse(savedBg));
      if (savedTheme) setThemeConfig(JSON.parse(savedTheme));
    } catch (e) {
      console.error("Failed to load local config history:", e);
    }
  }, []);

  // Save color config changes
  useEffect(() => {
    localStorage.setItem("bg_config_v2", JSON.stringify(bgConfig));
    localStorage.setItem("theme_config_v2", JSON.stringify(themeConfig));
  }, [bgConfig, themeConfig]);

  const calculateStats = (savedAttempts: HistoricalAttempt[]) => {
    if (savedAttempts.length === 0) return;
    const total = savedAttempts.length;
    const best = Math.max(...savedAttempts.map(a => a.score));
    
    let totalScoreSum = 0;
    let totalQuestionsSum = 0;
    
    savedAttempts.forEach(a => {
      totalScoreSum += a.score;
      totalQuestionsSum += a.total;
    });

    const averageAccuracy = totalQuestionsSum > 0 ? Math.round((totalScoreSum / totalQuestionsSum) * 100) : 0;
    
    setStats({
      totalQuizzes: total,
      bestScore: best,
      overallAccuracy: averageAccuracy,
    });
  };

  // Launch standard quiz
  const handleLaunchStandardQuiz = () => {
    const selectedLevel = level === "Aralash" ? "" : level;
    const selectedCat = category === "Aralash" ? "" : category;
    
    const quizQuestions = getRandomQuestions(selectedLevel, selectedCat, questionsCount);
    
    if (quizQuestions.length < 5) {
      alert("Tanlangan ruknda yetarli savollar topilmadi. Iltimos boshqa daraja yoki 'Aralash' xususiyatini tanlang.");
      return;
    }

    setActiveQuestions(quizQuestions);
    setIsGameActive(true);
    setIsGameFinished(false);
  };

  // Launch customized AI quiz using express /api/generate-quiz
  const handleLaunchAiQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsAiGenerating(true);
    setAiError(null);
    setAiStep("AI so'rovingiz tahlil qilinmoqda...");

    const steps = [
      "Daraja standartlari tekshirilmoqda...",
      "Lug'at va grammatik testlar tayyorlanmoqda...",
      "O'zbekcha o'quv izohlari yozilmoqda...",
      "Tuzilma formatlanmoqda..."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setAiStep(steps[stepIdx]);
        stepIdx++;
      }
    }, 1500);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          count: questionsCount,
        }),
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success && data.questions && data.questions.length > 0) {
        setActiveQuestions(data.questions);
        setIsGameActive(true);
        setIsGameFinished(false);
        setAiTopic(""); // Clear topic input
      } else {
        throw new Error(data.error || "Savollar ko'rsatkichi noto'g'ri qaytdi.");
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      
      // Set error message
      setAiError(err.message || "AI generatsiyada muammo yuz berdi. Offline rejimda ishlashni taklif qilamiz.");
      
      // Fallback transition
      setTimeout(() => {
        setAiError(null);
        // Fallback to random questions with a similar topic
        const fallbackLevel = level === "Aralash" ? "Intermediate" : level;
        const fallbackQuestions = getRandomQuestions(fallbackLevel, "", questionsCount);
        setActiveQuestions(fallbackQuestions);
        setIsGameActive(true);
        setIsGameFinished(false);
      }, 3500);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Complete session and log attempt
  const handleFinishedQuiz = (
    score: number, 
    wrong: number, 
    skipped: number, 
    answers: { [key: number]: number | null }
  ) => {
    setFinalScore(score);
    setFinalWrong(wrong);
    setFinalSkipped(skipped);
    setUserAnswers(answers);
    setIsGameActive(false);
    setIsGameFinished(true);

    // Save statistics locally
    const attemptsCount = activeQuestions.length;
    const accuracyVal = attemptsCount > 0 ? Math.round((score / attemptsCount) * 100) : 0;
    
    // Create attempt model
    const newAttempt: HistoricalAttempt = {
      id: "at-" + Date.now(),
      date: new Date().toLocaleDateString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
      score: score,
      total: attemptsCount,
      accuracy: accuracyVal,
      topic: aiTopic ? `AI: ${aiTopic}` : `Oral: ${level} (${category})`,
    };

    const nextAttempts = [newAttempt, ...attempts].slice(0, 50); // limit to last 50
    setAttempts(nextAttempts);
    localStorage.setItem("english_quiz_attempts_v2", JSON.stringify(nextAttempts));
    calculateStats(nextAttempts);
  };

  // Reset local statistics
  const handleClearHistory = () => {
    if (confirm("Hamma test natijalari yozuvlarini o'chirishni xohlaysizmi?")) {
      localStorage.removeItem("english_quiz_attempts_v2");
      setAttempts([]);
      setStats({ totalQuizzes: 0, bestScore: 0, overallAccuracy: 0 });
    }
  };

  const getAccentBgClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20";
      case "indigo": return "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20";
      case "violet": return "bg-violet-600 hover:bg-violet-700 focus:ring-violet-500/20";
      case "rose": return "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500/20";
      case "amber": return "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/20";
      case "teal": return "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500/20";
      case "sky": return "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500/20";
      case "fuchsia": return "bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-fuchsia-500/20";
      default: return "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20";
    }
  };

  const getAccentTextClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "text-emerald-400";
      case "indigo": return "text-indigo-400";
      case "violet": return "text-violet-400";
      case "rose": return "text-rose-400";
      case "amber": return "text-amber-400";
      case "teal": return "text-teal-400";
      case "sky": return "text-sky-400";
      case "fuchsia": return "text-fuchsia-400";
      default: return "text-indigo-400";
    }
  };

  const getAccentBorderClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "border-emerald-500/20 hover:border-emerald-500";
      case "indigo": return "border-indigo-500/20 hover:border-indigo-500";
      case "violet": return "border-violet-500/20 hover:border-violet-500";
      case "rose": return "border-rose-500/20 hover:border-rose-500";
      case "amber": return "border-amber-500/20 hover:border-amber-500";
      case "teal": return "border-teal-500/20 hover:border-teal-500";
      case "sky": return "border-sky-500/20 hover:border-sky-500";
      case "fuchsia": return "border-fuchsia-500/20 hover:border-fuchsia-500";
      default: return "border-indigo-500/20 hover:border-indigo-500";
    }
  };

  const getAccentTextColorClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "text-emerald-600 dark:text-emerald-400";
      case "indigo": return "text-indigo-600 dark:text-indigo-400";
      case "violet": return "text-violet-600 dark:text-violet-400";
      case "rose": return "text-rose-600 dark:text-rose-400";
      case "amber": return "text-amber-600 dark:text-amber-400";
      case "teal": return "text-teal-600 dark:text-teal-400";
      case "sky": return "text-sky-600 dark:text-sky-400";
      case "fuchsia": return "text-fuchsia-600 dark:text-fuchsia-400";
      default: return "text-indigo-600 dark:text-indigo-400";
    }
  };

  const getAccentLightBgClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20";
      case "indigo": return "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-500/20";
      case "violet": return "bg-violet-500/10 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 border border-violet-500/20";
      case "rose": return "bg-rose-500/10 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-500/20";
      case "amber": return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/20";
      case "teal": return "bg-teal-500/10 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-500/20";
      case "sky": return "bg-sky-500/10 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-500/20";
      case "fuchsia": return "bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 border border-fuchsia-500/20";
      default: return "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-500/20";
    }
  };

  const getAccentBorderActiveClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "indigo": return "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
      case "violet": return "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400";
      case "rose": return "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
      case "amber": return "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "teal": return "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400";
      case "sky": return "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400";
      case "fuchsia": return "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400";
      default: return "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400";
    }
  };

  const getAccentSliderClass = () => {
    switch (themeConfig.accentColor) {
      case "emerald": return "accent-emerald-500";
      case "indigo": return "accent-indigo-600";
      case "violet": return "accent-violet-500";
      case "rose": return "accent-rose-500";
      case "amber": return "accent-amber-500";
      case "teal": return "accent-teal-500";
      case "sky": return "accent-sky-500";
      case "fuchsia": return "accent-fuchsia-500";
      default: return "accent-indigo-600";
    }
  };

  const textPrimaryClass = themeConfig.darkTheme ? "text-white" : "text-slate-800";
  const textSecondaryClass = themeConfig.darkTheme ? "text-slate-300" : "text-slate-600";
  const bgCardClass = themeConfig.darkTheme ? "bg-slate-900" : "bg-white";
  const borderClass = themeConfig.darkTheme ? "border-slate-800" : "border-slate-100";

  return (
    <div className={`min-h-screen text-sans transition-all duration-300 ${themeConfig.darkTheme ? "dark text-white" : "bg-slate-100 text-slate-800"}`}>
      {/* Background with custom filters, speed and colors */}
      <BackgroundCanvas config={bgConfig} />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-6 flex flex-col min-h-screen justify-between relative z-10 select-none">
        
        {/* App Title Header */}
        <header 
          className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 rounded-2xl border transition shadow-lg gap-4"
          style={{ 
            backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
            backdropFilter: "blur(12px)",
            borderColor: borderClass
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${getAccentLightBgClass()}`}>
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className={`text-base sm:text-lg font-bold tracking-tight leading-none mb-1 ${textPrimaryClass}`}>
                Ingliz Tili Testi va Dizayn Sozlamasi
              </h1>
              <p className={`text-[11px] font-normal leading-none ${textSecondaryClass}`}>
                Dinamik orqa fonlar va AI savollar muharriri bilan
              </p>
            </div>
          </div>

          {/* Quick HUD Navigation */}
          {!isGameActive && (
            <div className="flex gap-2.5 bg-slate-500/5 p-1 rounded-xl">
              <button
                type="button"
                id="tab-quiz"
                onClick={() => setCurrentTab("quiz")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${currentTab === "quiz" ? `${getAccentBgClass()} text-white shadow-sm` : textSecondaryClass}`}
              >
                Test Markazi
              </button>
              <button
                type="button"
                id="tab-settings"
                onClick={() => setCurrentTab("settings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${currentTab === "settings" ? `${getAccentBgClass()} text-white shadow-sm` : textSecondaryClass}`}
              >
                Ranglar darchasi
              </button>
              <button
                type="button"
                id="tab-history"
                onClick={() => setCurrentTab("history")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${currentTab === "history" ? `${getAccentBgClass()} text-white shadow-sm` : textSecondaryClass}`}
              >
                Natijalar tahlili
              </button>
            </div>
          )}
        </header>

        {/* ACTIVE GAME VIEW SCREEN */}
        {isGameActive && (
          <main className="flex-1 py-4 flex items-center justify-center">
            <QuizGame
              questions={activeQuestions}
              durationPerQuestion={duration}
              accentColor={themeConfig.accentColor}
              darkTheme={themeConfig.darkTheme}
              cardOpacity={bgConfig.cardOpacity}
              onFinish={handleFinishedQuiz}
              onQuit={() => setIsGameActive(false)}
            />
          </main>
        )}

        {/* COMPLETED RESULTS SCREEN */}
        {isGameFinished && !isGameActive && (
          <main className="flex-1 py-4 flex items-center justify-center">
            <div 
              className="w-full max-w-xl rounded-3xl border shadow-xl p-6 sm:p-8 space-y-6 text-center animate-scale-up"
              style={{ 
                backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                backdropFilter: "blur(16px)",
                borderColor: borderClass
              }}
            >
              {/* Header result badge */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${getAccentLightBgClass()}`}>
                  <Trophy className="w-8 h-8 shrink-0" />
                </div>
                <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${textPrimaryClass}`}>
                  Sinov yakunlandi! 
                </h2>
                <p className={`text-xs ${textSecondaryClass}`}>
                  Natijalar muvaffaqiyatli saqlandi va tahlil kilindi.
                </p>
              </div>

              {/* Big Score Visual */}
              <div className="py-2">
                <div className={`text-[64px] font-extrabold leading-none tracking-tighter ${getAccentTextColorClass()}`}>
                  {finalScore} <span className={`text-xl font-normal ${textSecondaryClass}`}>/ {activeQuestions.length}</span>
                </div>
                <div className={`text-xs font-semibold uppercase tracking-wider ${textSecondaryClass} mt-1`}>
                  Muvaffaqiyat ko'rsatkichi: {Math.round((finalScore / activeQuestions.length) * 100)}%
                </div>
              </div>

              {/* Stats Breakdown Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl border ${themeConfig.darkTheme ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                  <strong className={`block text-lg font-bold ${getAccentTextClass()}`}>{finalScore}</strong>
                  <span className={`text-[10px] uppercase font-medium tracking-wider ${textSecondaryClass}`}>To'g'ri</span>
                </div>
                <div className={`p-3 rounded-xl border ${themeConfig.darkTheme ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                  <strong className="block text-lg font-bold text-rose-500">{finalWrong}</strong>
                  <span className={`text-[10px] uppercase font-medium tracking-wider ${textSecondaryClass}`}>Noto'g'ri</span>
                </div>
                <div className={`p-3 rounded-xl border ${themeConfig.darkTheme ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                  <strong className="block text-lg font-bold text-amber-500">{finalSkipped}</strong>
                  <span className={`text-[10px] uppercase font-medium tracking-wider ${textSecondaryClass}`}>O'tkazilgan</span>
                </div>
              </div>

              {/* Learning Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  id="open-review-btn"
                  onClick={() => setIsReviewOpen(true)}
                  className={`w-full py-3.5 text-white rounded-xl font-bold cursor-pointer text-xs sm:text-sm shadow-md transition transform hover:scale-101 active:scale-98 flex items-center justify-center gap-2 ${getAccentBgClass()}`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Xatolar tahlili & O'zbekcha izohlarni ko'rish</span>
                </button>

                <button
                  type="button"
                  id="retry-quiz-btn"
                  onClick={() => {
                    setIsGameFinished(false);
                    setIsGameActive(false);
                  }}
                  className={`w-full py-3 hover:bg-slate-500/10 rounded-xl font-semibold cursor-pointer text-xs transition border ${
                    themeConfig.darkTheme ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600 bg-white"
                  }`}
                >
                  Asosiy sahifaga qaytish
                </button>
              </div>
            </div>
          </main>
        )}

        {/* LOADING INDICATOR: AI GENERATING SCREEN */}
        {isAiGenerating && !isGameActive && (
          <main className="flex-1 py-10 flex items-center justify-center">
            <div 
              className="w-full max-w-md rounded-2xl border p-8 space-y-6 text-center animate-pulse"
              style={{ 
                backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                backdropFilter: "blur(12px)",
                borderColor: borderClass
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin`} />
                <div className="space-y-1.5">
                  <h3 className={`font-bold text-base sm:text-lg ${textPrimaryClass}`}>
                    AI maxsus test materiallari tayyorlamoqda
                  </h3>
                  <p className={`text-xs ${getAccentTextClass()} font-semibold`}>
                    {aiStep}
                  </p>
                </div>
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[11px] leading-relaxed text-slate-400">
                  <p className="italic">
                    Gemini tahlilchisi eng qiziqarli variantlarni tartiblashtirmoqda. Iltimos bir necha soniya kutib turing...
                  </p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* STANDARD DASHBOARD LANDING SCREEN */}
        {!isGameActive && !isGameFinished && !isAiGenerating && (
          <main className="flex-1 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT WING - QUIZ CONTROLLER CENTER */}
            {currentTab === "quiz" && (
              <div 
                className="lg:col-span-7 rounded-3xl border shadow-xl p-5 sm:p-7 space-y-6 transition relative"
                style={{ 
                  backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  backdropFilter: "blur(14px)",
                  borderColor: borderClass
                }}
              >
                {/* Standard Launcher Panel */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Compass className={`w-5 h-5 shrink-0 ${getAccentTextColorClass()}`} />
                    <h3 className={`text-sm font-bold tracking-wider uppercase ${textPrimaryClass}`}>
                      Standart Test Sozlamalari
                    </h3>
                  </div>

                  {/* Level picker */}
                  <div className="space-y-2">
                    <label className={`block text-xs font-semibold uppercase tracking-wider ${textSecondaryClass}`}>
                      Kattalik/Daraja (Level)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(["Aralash", "Elementary", "Intermediate", "Advanced"] as const).map((lvl) => (
                        <button
                           key={lvl}
                           type="button"
                           id={`lvl-btn-${lvl}`}
                           onClick={() => setLevel(lvl)}
                           className={`px-3 py-2 border rounded-xl text-xs font-semibold cursor-pointer text-center uppercase tracking-wide transition ${
                             level === lvl
                               ? getAccentBorderActiveClass()
                               : themeConfig.darkTheme ? "border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-600" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                           }`}
                        >
                          {lvl === "Aralash" ? "Aralash" : lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category picker & timer parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`block text-xs font-semibold uppercase tracking-wider ${textSecondaryClass}`}>
                        Savol turi (Category)
                      </label>
                      <div className="flex gap-2">
                        {(["Aralash", "Grammar", "Vocabulary"] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            id={`cat-btn-${cat}`}
                            onClick={() => setCategory(cat)}
                            className={`w-full py-2.5 border rounded-xl text-xs font-semibold cursor-pointer text-center tracking-wide transition ${
                              category === cat
                                ? getAccentBorderActiveClass()
                                : themeConfig.darkTheme ? "border-slate-800 bg-slate-950/20 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {cat === "Aralash" ? "Aralash" : cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                        <span className={textSecondaryClass}>Savol muddati (Timer)</span>
                        <span className={textPrimaryClass}>{duration} soniya</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          id="timer-range"
                          min="10"
                          max="60"
                          step="5"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer ${getAccentSliderClass()}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Standard Start Button */}
                  <button
                    type="button"
                    id="launch-standard-quiz"
                    onClick={handleLaunchStandardQuiz}
                    className={`w-full py-4 text-xs sm:text-sm font-bold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${getAccentBgClass()}`}
                  >
                    <Play className="w-4 h-4 fill-white text-white shrink-0" />
                    <span>Standart Testni Boshlash ({questionsCount} ta savol)</span>
                  </button>
                </div>

                {/* THE AI SPARK - CUSTOM AI MAKER */}
                <div className={`pt-5 border-t border-dashed ${borderClass} space-y-4`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                      <h3 className={`text-sm font-bold tracking-wider uppercase ${textPrimaryClass}`}>
                        AI Custom Test Generator
                      </h3>
                    </div>
                    <span className="text-[10px] bg-indigo-505/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold uppercase">
                      Gemini kuchaytirgan
                    </span>
                  </div>

                  <p className={`text-xs ${textSecondaryClass} leading-relaxed`}>
                    O'zingiz xohlagan har qanday mavzu yoki formatni kiriting (Masalan: <span className="italic">"IELTS imtihoni uchun murakkab antonimlar"</span>, <span className="italic">"Sayohat haqida so'zlashuv iboralari"</span>, <span className="italic">"Irregular verbs"</span>) – model 15 ta maxsus savollarni o'zbekcha tushuntirishi bilan tuzib beradi.
                  </p>

                  <form onSubmit={handleLaunchAiQuiz} className="space-y-3">
                    <div className="flex gap-2 relative">
                      <input
                        type="text"
                        id="ai-topic-input"
                        placeholder="Mavzu yoki yo'nalishni kiriting..."
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 outline-none ${textPrimaryClass} ${borderClass}`}
                      />
                      <button
                        type="submit"
                        disabled={!aiTopic.trim()}
                        className={`px-5 py-3 rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer flex items-center justify-center gap-1.5 transition ${
                          aiTopic.trim() 
                            ? "bg-indigo-600 hover:bg-indigo-700 shadow-md transform hover:scale-[1.02]" 
                            : "bg-slate-300/10 text-slate-500 cursor-not-allowed border-transparent"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tuzish</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className={textSecondaryClass}>Savollar soni: <strong>{questionsCount} ta</strong></span>
                      <div className="flex gap-2">
                        {[10, 15, 20].map((c) => (
                          <button
                            key={c}
                            type="button"
                            id={`q-count-btn-${c}`}
                            onClick={() => setQuestionsCount(c)}
                            className={`px-2 py-0.5 rounded border transition ${questionsCount === c ? getAccentBorderActiveClass() : "border-slate-800 text-slate-500"}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* QUICK SETTINGS VIEW */}
            {currentTab === "settings" && (
              <div 
                className="lg:col-span-7 rounded-3xl border shadow-xl p-5 sm:p-7 space-y-6 transition relative"
                style={{ 
                  backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  backdropFilter: "blur(14px)",
                  borderColor: borderClass
                }}
              >
                <ThemeCustomizer
                  bgConfig={bgConfig}
                  setBgConfig={setBgConfig}
                  themeConfig={themeConfig}
                  setThemeConfig={setThemeConfig}
                />
              </div>
            )}

            {/* PREVIOUS ATTEMPTS HISTORY VIEW */}
            {currentTab === "history" && (
              <div 
                className="lg:col-span-7 rounded-3xl border shadow-xl p-5 sm:p-7 space-y-6 transition relative"
                style={{ 
                  backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  backdropFilter: "blur(14px)",
                  borderColor: borderClass
                }}
              >
                <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <History className={`w-5 h-5 ${getAccentTextColorClass()}`} />
                    <h3 className={`text-sm font-bold uppercase ${textPrimaryClass}`}>
                      Natijalar Arxivi ({attempts.length})
                    </h3>
                  </div>

                  {attempts.length > 0 && (
                    <button
                      type="button"
                      id="clear-history-btn"
                      onClick={handleClearHistory}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/5 text-xs font-semibold cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Tozalash</span>
                    </button>
                  )}
                </div>

                {attempts.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <History className="w-12 h-12 text-slate-500 mx-auto opacity-30 shrink-0" />
                    <div className="space-y-1">
                      <h4 className={`font-semibold text-xs sm:text-sm ${textPrimaryClass}`}>Oxirgi urinishlar topilmadi</h4>
                      <p className={`text-xs ${textSecondaryClass} max-w-sm mx-auto leading-relaxed`}>
                        Siz hali birorta ham sinov topshirmadingiz. Testlarni boshlang va natijalarni bu yerda tahlil qiling.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                    {attempts.map((att) => (
                      <div
                        key={att.id}
                        className={`p-3.5 rounded-xl border flex justify-between items-center text-xs gap-3 ${
                          themeConfig.darkTheme ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className={`text-[11px] font-semibold text-slate-400 flex items-center gap-1`}>
                            <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                            {att.date}
                          </span>
                          <strong className={`block text-xs font-medium truncate max-w-[220px] ${textPrimaryClass}`}>
                            {att.topic}
                          </strong>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className={`block text-sm font-semibold ${getAccentTextColorClass()}`}>
                              {att.score} / {att.total}
                            </span>
                            <span className={`text-[10px] ${textSecondaryClass}`}>
                              Aniq: {att.accuracy}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RIGHT WING - LIVE STATS & PRESETS (SPLIT CONTROL SIDEBAR) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Panel A: Study Performance Statistics */}
              <div 
                className="rounded-3xl border shadow-lg p-5 transition text-xs"
                style={{ 
                  backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  backdropFilter: "blur(12px)",
                  borderColor: borderClass
                }}
              >
                <div className="flex items-center gap-2 mb-4 shrink-0 justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${getAccentTextColorClass()}`} />
                    <h4 className={`font-semibold uppercase tracking-wider ${textPrimaryClass}`}>Sizning Ko'rsatkichlaringiz</h4>
                  </div>
                  <span className="text-[10px] font-semibold opacity-60 uppercase">Maxsus status</span>
                </div>

                <div className="grid grid-cols-3 gap-3.5 mb-2">
                  <div className={`p-3 rounded-2xl border text-center ${themeConfig.darkTheme ? "bg-slate-950/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                    <strong className={`block text-xl font-extrabold ${getAccentTextColorClass()}`}>{stats.totalQuizzes}</strong>
                    <span className={`text-[9px] uppercase font-semibold text-slate-400 tracking-wide`}>Sinovlar</span>
                  </div>
                  <div className={`p-3 rounded-2xl border text-center ${themeConfig.darkTheme ? "bg-slate-950/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                    <strong className="block text-xl font-extrabold text-amber-500">{stats.bestScore}</strong>
                    <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wide">Eng yaxshi</span>
                  </div>
                  <div className={`p-3 rounded-2xl border text-center ${themeConfig.darkTheme ? "bg-slate-950/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                    <strong className={`block text-xl font-extrabold ${getAccentTextColorClass()}`}>{stats.overallAccuracy}%</strong>
                    <span className="text-[9px] uppercase font-semibold text-slate-400 tracking-wide">Aniqlik</span>
                  </div>
                </div>
              </div>

              {/* Panel B: Parallel Fast Customizer Panel */}
              <div 
                className="rounded-3xl border shadow-lg p-5 transition text-xs"
                style={{ 
                  backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 2.55).toString(16).padStart(2, '0')}`,
                  backdropFilter: "blur(12px)",
                  borderColor: borderClass
                }}
              >
                <div className="flex items-center justify-between mb-4.5">
                  <div className="flex items-center gap-2">
                    <Palette className={`w-4 h-4 shrink-0 ${getAccentTextColorClass()}`} />
                    <h4 className={`font-semibold uppercase tracking-wider ${textPrimaryClass}`}>Ranglar va Orqa Fon</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab("settings")}
                    className={`text-[10px] font-bold underline uppercase hover:opacity-80 ${getAccentTextColorClass()}`}
                  >
                    Barcha Sozlamalar
                  </button>
                </div>

                {/* Instant Presets select-grid */}
                <div className="space-y-3">
                  <p className={`text-[11px] leading-relaxed ${textSecondaryClass}`}>
                    Darhol orqa fon shablonini o'zgartirish:
                  </p>
                  <div className="flex flex-col gap-2">
                    {PRESET_THEMES.map((preset, idx) => {
                      const isMatch = themeConfig.accentColor === preset.accent && bgConfig.colorStart === preset.bg.colorStart;
                      return (
                        <button
                          key={idx}
                          type="button"
                          id={`preset-quick-${idx}`}
                          onClick={() => {
                            setThemeConfig({
                              accentColor: preset.accent,
                              glassStyle: preset.dark ? "frosted" : "sleek",
                              darkTheme: preset.dark,
                            });
                            setBgConfig(preset.bg);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                            isMatch 
                              ? getAccentBorderActiveClass() 
                              : themeConfig.darkTheme ? "border-slate-800 bg-slate-950/20 hover:border-slate-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/40 block" 
                              style={{ backgroundColor: preset.bg.colorStart }} 
                            />
                            <span className={`text-[11px] font-medium ${isMatch ? `${getAccentTextClass()} font-bold` : textPrimaryClass}`}>
                              {preset.name.split(" (")[0]}
                            </span>
                          </div>
                          {isMatch && <span className={`w-1.5 h-1.5 rounded-full block ${getAccentBgClass().split(' ')[0]}`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </main>
        )}

        {/* Footer info panel */}
        <footer 
          className="px-6 py-4 rounded-xl border text-center text-[10px] font-medium leading-relaxed tracking-wide gap-2 mt-4 shrink-0"
          style={{ 
            backgroundColor: `${bgCardClass}${Math.round(bgConfig.cardOpacity * 1.5).toString(16).padStart(2, '0')}`,
            borderColor: borderClass
          }}
        >
          <div className="flex justify-center items-center gap-1 mb-1 font-semibold">
            <Info className={`w-3.5 h-3.5 ${getAccentTextColorClass()}`} />
            <sapn className={textPrimaryClass}>Metodik Qo'llanma & Foydalanuvchi Qo'llanmasi</sapn>
          </div>
          <p className={textSecondaryClass}>
            Ushbu dastur Ingliz tili qoidalari tahlili va interfeys muhandisligi asosida ishlaydi. 
            Xatolar tahlilida o'zbek tilidagi qoidalar tushuntirib boriladi.
          </p>
        </footer>

      </div>

      {/* DETAILED EXPLANATION REVIEW WINDOW OVERLAY */}
      <ReviewModal
        questions={activeQuestions}
        userAnswers={userAnswers}
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setIsGameFinished(false);
          setIsGameActive(false);
        }}
        darkTheme={themeConfig.darkTheme}
      />
    </div>
  );
}
