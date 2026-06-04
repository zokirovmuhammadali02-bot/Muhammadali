import React from "react";
import { BackgroundConfig } from "../types";

interface BackgroundCanvasProps {
  config: BackgroundConfig;
}

export default function BackgroundCanvas({ config }: BackgroundCanvasProps) {
  // Translate tailwind directions
  const mapDirection = (dir: string) => {
    switch (dir) {
      case "to-br": return "135deg";
      case "to-tr": return "45deg";
      case "to-b": return "180deg";
      case "to-r": return "90deg";
      case "to-tl": return "315deg";
      default: return "135deg";
    }
  };

  const gradientStyle: React.CSSProperties = {
    background: config.type === "solid"
      ? config.colorStart
      : `linear-gradient(${mapDirection(config.direction)}, ${config.colorStart} 0%, ${config.colorEnd} 100%)`,
    transition: "background 0.8s ease-in-out, filter 0.8s ease",
  };

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden select-none" style={gradientStyle}>
      {/* Mesh Blur Elements for gorgeous glowing background aesthetics */}
      {config.type === "mesh" && (
        <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-70">
          <div 
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-40 blur-[120px] animate-pulse"
            style={{ 
              background: config.colorStart, 
              animationDuration: "8s",
              filter: `blur(${config.blur}px)` 
            }}
          />
          <div 
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-40 blur-[120px] animate-pulse"
            style={{ 
              background: config.colorEnd, 
              animationDuration: "12s",
              animationDelay: "2s",
              filter: `blur(${config.blur}px)` 
            }}
          />
          <div 
            className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full opacity-30 blur-[130px]"
            style={{ 
              background: "#a855f7", 
              filter: `blur(${config.blur}px)` 
            }}
          />
        </div>
      )}

      {/* Cosmic Overlay */}
      {config.type === "cosmic" && (
        <div className="absolute inset-0 overflow-hidden bg-radial from-slate-900 via-neutral-950 to-black">
          {/* Virtual Stars */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent bg-repeat" 
               style={{ backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 100px 150px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 150px 240px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 250px 50px, #e2e8f0, rgba(0,0,0,0))` }} />
          <div 
            className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-sky-500/15 rounded-full blur-[90px] animate-pulse"
            style={{ animationDuration: "15s" }}
          />
          <div 
            className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: "18s", animationDelay: "3s" }}
          />
        </div>
      )}

      {/* Retro Grid / Grid Overlay */}
      {config.showGrid && (
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            color: "currentColor"
          }}
        />
      )}

      {/* Dot matrix overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 0.75px, transparent 0.75px)`,
          backgroundSize: "12px 12px",
          color: "currentColor"
        }}
      />

      {/* CSS Floating Particles */}
      {config.showParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen">
          <div className="absolute top-[10%] left-[15%] w-3 h-3 bg-white/20 rounded-full animate-bounce filter blur-xs" style={{ animationDuration: "6s" }} />
          <div className="absolute top-[45%] left-[80%] w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }} />
          <div className="absolute top-[75%] left-[30%] w-4 h-4 bg-white/10 rounded-full animate-bounce filter blur-[2px]" style={{ animationDuration: "10s", animationDelay: "2s" }} />
          <div className="absolute top-[20%] left-[65%] w-2.5 h-2.5 bg-white/25 rounded-full animate-pulse" style={{ animationDuration: "7s", animationDelay: "3s" }} />
          <div className="absolute top-[85%] left-[70%] w-3 h-3 bg-white/15 rounded-full animate-bounce" style={{ animationDuration: "9s", animationDelay: "0.5s" }} />
        </div>
      )}
    </div>
  );
}
