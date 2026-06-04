import React from "react";
import { BackgroundConfig, ThemeConfig } from "../types";
import { Sliders, Palette, Monitor, Sparkles, Moon, Sun, Table, Check, Eye } from "lucide-react";

interface ThemeCustomizerProps {
  bgConfig: BackgroundConfig;
  setBgConfig: React.Dispatch<React.SetStateAction<BackgroundConfig>>;
  themeConfig: ThemeConfig;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
}

export const PRESET_THEMES = [
  {
    name: "Zümrad Shovqini (Emerald Whisper)",
    accent: "emerald" as const,
    bg: {
      type: "mesh" as const,
      colorStart: "#064e3b",
      colorEnd: "#022c22",
      direction: "to-br",
      blur: 130,
      showGrid: true,
      showParticles: true,
      cardOpacity: 85,
      blendMode: "screen",
    },
    dark: true,
  },
  {
    name: "Kosmik Oqshom (Cosmic Indigo)",
    accent: "indigo" as const,
    bg: {
      type: "cosmic" as const,
      colorStart: "#1e1b4b",
      colorEnd: "#0f052d",
      direction: "to-b",
      blur: 100,
      showGrid: true,
      showParticles: true,
      cardOpacity: 75,
      blendMode: "screen",
    },
    dark: true,
  },
  {
    name: "Kiberpank Tungi (Cyberpunk Neon)",
    accent: "fuchsia" as const,
    bg: {
      type: "gradient" as const,
      colorStart: "#1e1b4b",
      colorEnd: "#4c1d95",
      direction: "to-tr",
      blur: 40,
      showGrid: true,
      showParticles: true,
      cardOpacity: 80,
      blendMode: "screen",
    },
    dark: true,
  },
  {
    name: "Sahro Quyoshi (Warm Safari)",
    accent: "amber" as const,
    bg: {
      type: "mesh" as const,
      colorStart: "#451a03",
      colorEnd: "#1a0500",
      direction: "to-br",
      blur: 120,
      showGrid: false,
      showParticles: true,
      cardOpacity: 90,
      blendMode: "screen",
    },
    dark: true,
  },
  {
    name: "Minimalist Yengil (Clean Minimalist)",
    accent: "sky" as const,
    bg: {
      type: "gradient" as const,
      colorStart: "#f8fafc",
      colorEnd: "#e2e8f0",
      direction: "to-b",
      blur: 30,
      showGrid: true,
      showParticles: false,
      cardOpacity: 95,
      blendMode: "normal",
    },
    dark: false,
  },
];

const ACCENT_COLORS = [
  { id: "emerald", label: "Zümrad", color: "bg-emerald-500" },
  { id: "indigo", label: "Indigo", color: "bg-indigo-500" },
  { id: "violet", label: "Binafsha", color: "bg-violet-500" },
  { id: "rose", label: "Gulgun", color: "bg-rose-500" },
  { id: "amber", label: "Zubayr", color: "bg-amber-500" },
  { id: "teal", label: "Ko'k-yashil", color: "bg-teal-500" },
  { id: "sky", label: "Moviy", color: "bg-sky-500" },
  { id: "fuchsia", label: "Fuksiya", color: "bg-fuchsia-500" },
] as const;

export default function ThemeCustomizer({
  bgConfig,
  setBgConfig,
  themeConfig,
  setThemeConfig,
}: ThemeCustomizerProps) {
  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setThemeConfig({
      accentColor: preset.accent,
      glassStyle: preset.dark ? "frosted" : "sleek",
      darkTheme: preset.dark,
    });
    setBgConfig(preset.bg);
  };

  const getAccentBgClass = (accent: string) => {
    switch (accent) {
      case "emerald": return "bg-emerald-600 hover:bg-emerald-700";
      case "indigo": return "bg-indigo-600 hover:bg-indigo-700";
      case "violet": return "bg-violet-600 hover:bg-violet-700";
      case "rose": return "bg-rose-600 hover:bg-rose-700";
      case "amber": return "bg-amber-600 hover:bg-amber-700";
      case "teal": return "bg-teal-600 hover:bg-teal-700";
      case "sky": return "bg-sky-600 hover:bg-sky-700";
      case "fuchsia": return "bg-fuchsia-600 hover:bg-fuchsia-700";
      default: return "bg-emerald-600 hover:bg-emerald-700";
    }
  };

  const textPrimaryClass = themeConfig.darkTheme ? "text-white" : "text-slate-800";
  const textSecondaryClass = themeConfig.darkTheme ? "text-slate-300" : "text-slate-600";
  const borderClass = themeConfig.darkTheme ? "border-slate-700" : "border-slate-200";

  return (
    <div className="space-y-6">
      {/* SECTION 1: PRESET MASTER THEMING */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className={`w-5 h-5 ${themeConfig.darkTheme ? "text-emerald-400" : "text-emerald-600"}`} />
          <h3 className={`text-sm font-semibold tracking-wide uppercase ${textPrimaryClass}`}>
            Tayyor Rangli Shonlar (Presets)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PRESET_THEMES.map((preset, idx) => {
            const isMatch = themeConfig.accentColor === preset.accent && bgConfig.colorStart === preset.bg.colorStart;
            return (
              <button
                key={idx}
                type="button"
                id={`preset-${idx}`}
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isMatch
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5"
                    : themeConfig.darkTheme
                      ? "border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600"
                      : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {/* Visual Preview Badge */}
                <div className="flex items-center gap-2 mb-1.5 z-10">
                  <div className="flex -space-x-1">
                    <span className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: preset.bg.colorStart }} />
                    <span className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: preset.bg.colorEnd }} />
                  </div>
                  <span className={`text-xs font-semibold ${isMatch ? "text-emerald-500" : textPrimaryClass}`}>
                    {preset.name}
                  </span>
                </div>
                <span className={`text-[11px] leading-tight ${textSecondaryClass} uppercase z-10`}>
                  {preset.dark ? "To'q rejim · " : "Yorug' rejim · "} {preset.bg.type}
                </span>

                {isMatch && (
                  <div className="absolute right-3 top-3 bg-emerald-500 text-white rounded-full p-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CUSTOM COLOR COMBINATOR */}
      <div className={`pt-4 border-t ${borderClass}`}>
        <div className="flex items-center gap-2 mb-3 mt-1">
          <Sliders className={`w-5 h-5 ${themeConfig.darkTheme ? "text-indigo-400" : "text-indigo-600"}`} />
          <h3 className={`text-sm font-semibold tracking-wide uppercase ${textPrimaryClass}`}>
            Dizayn Sozlamalari (Dials)
          </h3>
        </div>

        {/* Custom Accent Picker */}
        <div className="space-y-3 mb-5">
          <label className={`block text-xs font-medium ${textSecondaryClass}`}>
            Aktiv interfeys rangi (Accent Color)
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((ac) => (
              <button
                key={ac.id}
                type="button"
                id={`accent-${ac.id}`}
                onClick={() => setThemeConfig({ ...themeConfig, accentColor: ac.id })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition border cursor-pointer ${
                  themeConfig.accentColor === ac.id
                    ? "border-emerald-500 bg-emerald-500/10 font-medium"
                    : themeConfig.darkTheme
                      ? "border-slate-700 hover:border-slate-500 bg-slate-800/40"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${ac.color}`} />
                <span className={textPrimaryClass}>{ac.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders: Opacity, Blur, Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className={textSecondaryClass}>Karta shaffofligi (Opacity)</span>
              <span className={textPrimaryClass}>{bgConfig.cardOpacity}%</span>
            </div>
            <input
              type="range"
              id="opacity-slider"
              min="10"
              max="100"
              value={bgConfig.cardOpacity}
              onChange={(e) => setBgConfig({ ...bgConfig, cardOpacity: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className={textSecondaryClass}>Glow/Blur effekti</span>
              <span className={textPrimaryClass}>{bgConfig.blur}px</span>
            </div>
            <input
              type="range"
              id="blur-slider"
              min="0"
              max="150"
              disabled={bgConfig.type !== "mesh"}
              value={bgConfig.blur}
              onChange={(e) => setBgConfig({ ...bgConfig, blur: parseInt(e.target.value) })}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 ${bgConfig.type !== "mesh" ? "opacity-30 cursor-not-allowed" : "bg-slate-200 dark:bg-slate-700"}`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className={textSecondaryClass}>Boshlang'ich rang (Start Color)</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="color" 
                id="color-start-picker"
                value={bgConfig.colorStart} 
                onChange={(e) => setBgConfig({ ...bgConfig, colorStart: e.target.value, type: bgConfig.type === "cosmic" ? "mesh" : bgConfig.type })}
                className="w-10 h-8 rounded border dark:border-slate-600 bg-transparent cursor-pointer"
              />
              <input 
                type="text" 
                value={bgConfig.colorStart} 
                onChange={(e) => setBgConfig({ ...bgConfig, colorStart: e.target.value, type: bgConfig.type === "cosmic" ? "mesh" : bgConfig.type })}
                className={`w-full px-2.5 py-1 text-xs rounded border bg-transparent ${textPrimaryClass} ${borderClass}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className={textSecondaryClass}>Tugash rangi (End Color)</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="color"
                id="color-end-picker"
                value={bgConfig.colorEnd} 
                onChange={(e) => setBgConfig({ ...bgConfig, colorEnd: e.target.value, type: bgConfig.type === "cosmic" ? "mesh" : bgConfig.type })}
                className="w-10 h-8 rounded border dark:border-slate-600 bg-transparent cursor-pointer"
              />
              <input 
                type="text" 
                value={bgConfig.colorEnd} 
                onChange={(e) => setBgConfig({ ...bgConfig, colorEnd: e.target.value, type: bgConfig.type === "cosmic" ? "mesh" : bgConfig.type })}
                className={`w-full px-2.5 py-1 text-xs rounded border bg-transparent ${textPrimaryClass} ${borderClass}`}
              />
            </div>
          </div>
        </div>

        {/* Secondary Toggles (Particles, Grid, Mode) */}
        <div className="mt-5 grid grid-cols-2 gap-3.5 pt-3">
          <button
            type="button"
            id="toggle-particles"
            onClick={() => setBgConfig({ ...bgConfig, showParticles: !bgConfig.showParticles })}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
              bgConfig.showParticles 
                ? "border-emerald-500 bg-emerald-500/5 text-emerald-500 font-medium" 
                : themeConfig.darkTheme ? "border-slate-700 bg-slate-800/30 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Suzuvchi zarralar</span>
          </button>

          <button
            type="button"
            id="toggle-grid"
            onClick={() => setBgConfig({ ...bgConfig, showGrid: !bgConfig.showGrid })}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
              bgConfig.showGrid 
                ? "border-emerald-500 bg-emerald-500/5 text-emerald-500 font-medium" 
                : themeConfig.darkTheme ? "border-slate-700 bg-slate-800/30 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <Table className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>To'r chiziqlari (Grid)</span>
          </button>

          <button
            type="button"
            id="toggle-darkmode"
            onClick={() => setThemeConfig({ ...themeConfig, darkTheme: !themeConfig.darkTheme })}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
              themeConfig.darkTheme 
                ? "border-indigo-500 bg-indigo-500/5 text-indigo-400 font-medium" 
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {themeConfig.darkTheme ? (
              <>
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>To'q rejim (Tungi)</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Yorug' rejim (Kunduzgi)</span>
              </>
            )}
          </button>

          <div
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs ${
              themeConfig.darkTheme ? "border-slate-700 bg-slate-850 text-slate-400" : "border-slate-200 bg-slate-100 text-slate-500"
            }`}
          >
            <Monitor className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Orqa fon turi: <strong className="font-semibold uppercase text-[10px]">{bgConfig.type}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
