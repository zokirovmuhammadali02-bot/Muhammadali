import React from "react";
import { Question } from "../types";
import { X, CheckCircle2, AlertCircle, HelpCircle, BookOpen } from "lucide-react";

interface ReviewModalProps {
  questions: Question[];
  userAnswers: { [key: number]: number | null };
  isOpen: boolean;
  onClose: () => void;
  darkTheme: boolean;
}

export default function ReviewModal({
  questions,
  userAnswers,
  isOpen,
  onClose,
  darkTheme,
}: ReviewModalProps) {
  if (!isOpen) return null;

  const textPrimaryClass = darkTheme ? "text-white" : "text-slate-800";
  const textSecondaryClass = darkTheme ? "text-slate-300" : "text-slate-600";
  const bgCardClass = darkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className={`w-full max-w-3xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-fade-in ${bgCardClass}`}
      >
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${darkTheme ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h3 className={`font-semibold text-base sm:text-lg ${textPrimaryClass}`}>
              Xatolari tahlil qilish & O'rganish (Review)
            </h3>
          </div>
          <button
            type="button"
            id="close-review-modal"
            onClick={onClose}
            className={`p-2 rounded-lg transition hover:bg-slate-500/10 ${textSecondaryClass}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 max-h-[70vh]">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.ans;
            const isSkipped = userAnswer === undefined || userAnswer === null;

            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCorrect 
                    ? darkTheme ? "border-emerald-500/30 bg-emerald-500/[0.02]" : "border-emerald-200 bg-emerald-50/20"
                    : isSkipped
                      ? darkTheme ? "border-amber-500/30 bg-amber-500/[0.02]" : "border-amber-200 bg-amber-50/20"
                      : darkTheme ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-rose-200 bg-rose-50/20"
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className={`text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase ${
                    isCorrect 
                      ? "bg-emerald-500/10 text-emerald-500"
                      : isSkipped
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-rose-500/10 text-rose-500"
                  }`}>
                    Savol {idx + 1} · {isCorrect ? "To'g'ri" : isSkipped ? "O'tkazib yuborilgan" : "Noto'g'ri"}
                  </span>

                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isSkipped ? (
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  )}
                </div>

                {/* Question text */}
                <p className={`font-medium text-sm sm:text-base mb-3 ${textPrimaryClass}`}>
                  {q.q}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3.5 text-xs sm:text-sm">
                  {q.opts.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === q.ans;
                    const isUserChoice = optIdx === userAnswer;

                    let optBg = darkTheme ? "bg-slate-900/30 border-slate-700/60 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500";
                    let optBorder = "border";

                    if (isCorrectOpt) {
                      optBg = darkTheme ? "bg-emerald-500/20 text-emerald-300 border-emerald-500" : "bg-emerald-50 text-emerald-800 border-emerald-400";
                    } else if (isUserChoice) {
                      optBg = darkTheme ? "bg-rose-500/20 text-rose-300 border-rose-500" : "bg-rose-50 text-rose-800 border-rose-400";
                    }

                    return (
                      <div 
                        key={optIdx} 
                        className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 transition ${optBg} ${optBorder}`}
                      >
                        <span className="font-semibold text-xs opacity-60">
                          {String.fromCharCode(65 + optIdx)})
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Explanation in Uzbek */}
                <div className={`p-3 rounded-lg border text-xs leading-relaxed ${darkTheme ? "bg-slate-900/60 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"}`}>
                  <strong className={`block text-xs font-semibold mb-1 flex items-center gap-1.5 ${darkTheme ? "text-emerald-400" : "text-emerald-700"}`}>
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    Nega bu javob to'g'ri?
                  </strong>
                  <p className="italic sm:not-italic">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-end shrink-0 ${darkTheme ? "border-slate-700 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
          <button
            type="button"
            id="close-review-modal-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm cursor-pointer shadow-lg transition"
          >
            Yopish va Bosh sahifaga qaytish 
          </button>
        </div>
      </div>
    </div>
  );
}
