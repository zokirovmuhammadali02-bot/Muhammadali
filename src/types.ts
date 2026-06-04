export interface Question {
  q: string;
  opts: string[];
  ans: number;
  explanation: string;
}

export interface BackgroundConfig {
  type: "gradient" | "solid" | "mesh" | "cosmic";
  colorStart: string;
  colorEnd: string;
  direction: string; // e.g., 'to-br', 'to-tr', 'to-b'
  blur: number; // 0 to 40 px
  showGrid: boolean;
  showParticles: boolean;
  cardOpacity: number; // 10 to 100 %
  blendMode: string;
}

export interface ThemeConfig {
  accentColor: "emerald" | "indigo" | "violet" | "rose" | "amber" | "teal" | "sky" | "fuchsia";
  glassStyle: "frosted" | "sleek" | "brutalist" | "flat" | "neon";
  darkTheme: boolean;
}

export interface QuizState {
  questions: Question[];
  currentIdx: number;
  score: number;
  wrongCount: number;
  skippedCount: number;
  userAnswers: { [key: number]: number | null }; // null means timed out
  timeLeft: number;
  isActive: boolean;
  isFinished: boolean;
  lifelinesUsed: {
    hint: boolean; // Removes an incorrect option
    doubleTime: boolean; // Doubles single question timer limit
  };
  durationPerQuestion: number;
}

export interface HistoricalAttempt {
  id: string;
  date: string;
  score: number;
  total: number;
  accuracy: number;
  topic: string;
}
