import React, { useState } from 'react';
import { Thermometer, Droplets, Clock, AlertTriangle, Wind, Info } from 'lucide-react';

export const GreenhouseClimateWidget: React.FC = () => {
  const [tempC, setTempC] = useState<number>(28.2);
  const [humidity, setHumidity] = useState<number>(73);
  const [vpd, setVpd] = useState<number>(1.08); // Vapor Pressure Deficit in kPa

  // Calculate egg hatch incubation window
  // Under optimal 27-30C: egg incubation takes ~4.2 days; at 18C: takes ~9.1 days
  const incubationDays = tempC >= 28 ? 4.2 : tempC >= 24 ? 5.8 : 8.5;
  const isHighRisk = tempC >= 26 && humidity >= 65;

  return (
    <div className="neuro-card rounded-2xl p-4 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block font-mono">
              MICROCLIMATE SENSORS · BLOCK B
            </span>
            <h4 className="text-xs font-bold text-white">
              Greenhouse Atmosphere & Egg Hatch Forecast
            </h4>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
            isHighRisk
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {isHighRisk ? 'RAPID EGG CYCLE ACCELERATION' : 'NORMAL GDD ACCUMULATION'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
        {/* Temperature */}
        <div className="neuro-inset rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Canopy Temp</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {tempC.toFixed(1)}°C
          </div>
          <span className="text-[10px] text-amber-400/90">Optimal Tuta band (25–30°C)</span>
        </div>

        {/* Humidity */}
        <div className="neuro-inset rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Relative RH</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {humidity}%
          </div>
          <span className="text-[10px] text-cyan-400/90">Favors Liriomyza flies</span>
        </div>

        {/* Egg Hatch Period */}
        <div className="neuro-inset rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">Egg Hatch Window</span>
            <Clock className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-400 font-mono tabular-nums">
            ~{incubationDays} days
          </div>
          <span className="text-[10px] text-rose-300/80">Accelerated by +35%</span>
        </div>

        {/* VPD */}
        <div className="neuro-inset rounded-xl p-2.5">
          <div className="flex items-center justify-between text-slate-400 mb-0.5">
            <span className="text-[11px]">VPD Transpiration</span>
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
            {vpd} kPa
          </div>
          <span className="text-[10px] text-emerald-400/80">Foliage stomata open</span>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>Campos et al. (2017) Model:</strong> Current greenhouse conditions will trigger adult moth oviposition peak within 48h. Ensure pheromone traps are baited before Wednesday evening.
        </span>
      </div>
    </div>
  );
};
