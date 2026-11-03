'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, X, RotateCcw, Sliders } from 'lucide-react';
import { useTheme, THEME_PRESETS, ThemePresetId } from './ThemeContext';

export function ThemeSwitcherDropdown() {
  const { theme, setTheme, customAccent, setCustomAccent, resetCustomAccent, contrastColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEME_PRESETS.find((t) => t.id === theme) || THEME_PRESETS[0];
  const activeColor = customAccent || currentTheme.primary;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-salon-gray bg-white/90 hover:bg-white text-xs font-medium text-salon-black shadow-xs transition-all hover:border-salon-rose"
        title="Change Salon Color Theme"
        aria-label="Change Color Theme"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-inner"
          style={{ backgroundColor: activeColor }}
        />
        <Palette className="w-3.5 h-3.5 text-salon-rose" />
        <span className="hidden xl:inline text-[11px] font-semibold">
          {customAccent ? 'Custom' : currentTheme.name.split(' ')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-luxury border border-salon-gray p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-salon-gray">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-salon-black">
              <Sparkles className="w-3.5 h-3.5 text-salon-rose" />
              <span>Salon Color Atmosphere</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-salon-muted hover:text-salon-black"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6 Theme Presets */}
          <div className="mt-2.5 space-y-1.5 max-h-60 overflow-y-auto pr-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-salon-muted block px-1">
              Curated Theme Presets
            </span>
            {THEME_PRESETS.map((t) => {
              const isSelected = t.id === theme && !customAccent;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    resetCustomAccent();
                    setTheme(t.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-2xl text-xs flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-salon-rose-light text-salon-black font-semibold ring-1 ring-salon-rose/40'
                      : 'hover:bg-salon-ivory text-salon-black'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: t.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: t.accent }}
                      />
                    </div>
                    <div>
                      <div className="font-serif font-bold leading-tight">{t.name}</div>
                      <div className="text-[10px] text-salon-muted leading-tight">{t.tagline}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-salon-rose shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Accent Picker Section */}
          <div className="mt-3 pt-3 border-t border-salon-gray space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-salon-black">
              <span className="flex items-center">
                <Sliders className="w-3 h-3 mr-1 text-salon-rose" />
                Custom Accent Color
              </span>
              {customAccent && (
                <button
                  type="button"
                  onClick={resetCustomAccent}
                  className="text-[11px] text-salon-muted hover:text-salon-rose flex items-center font-normal"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset to Preset
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="w-9 h-9 rounded-xl border border-salon-gray cursor-pointer p-0.5 bg-white"
                title="Select Custom Accent Color"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  maxLength={7}
                  placeholder="#B65B78"
                  value={hexInput || activeColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHexInput(val);
                    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                      setCustomAccent(val);
                    }
                  }}
                  className="w-full px-3 py-1.5 rounded-xl border border-salon-gray text-xs font-mono text-salon-black focus:outline-none focus:border-salon-rose"
                />
              </div>
              <div
                className="px-2 py-1.5 rounded-xl text-[10px] font-bold border border-black/10 shrink-0"
                style={{ backgroundColor: activeColor, color: contrastColor }}
                title="WCAG AA contrast evaluated automatically"
              >
                WCAG AA
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export function FloatingThemeWidget() {
  const { theme, setTheme, customAccent, setCustomAccent, resetCustomAccent } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {expanded && (
        <div className="mb-3 bg-white/95 backdrop-blur-md rounded-3xl shadow-luxury border border-salon-gray p-4 w-72 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-salon-gray text-xs font-bold text-salon-black">
            <span className="flex items-center">
              <Palette className="w-3.5 h-3.5 text-salon-rose mr-1.5" />
              Theme Palettes
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-salon-muted hover:text-salon-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {THEME_PRESETS.map((t) => {
              const isSelected = t.id === theme && !customAccent;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    resetCustomAccent();
                    setTheme(t.id);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-salon-rose-light font-bold ring-1 ring-salon-rose/50 shadow-xs'
                      : 'hover:bg-salon-ivory'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0"
                      style={{ backgroundColor: t.primary }}
                    />
                    <span className="block font-medium text-salon-black text-[11px]">{t.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-salon-rose" />}
                </button>
              );
            })}
          </div>

          {/* Quick custom accent input */}
          <div className="pt-2 border-t border-salon-gray flex items-center justify-between text-xs">
            <span className="text-[11px] text-salon-muted">Custom Accent:</span>
            <input
              type="color"
              value={customAccent || '#B65B78'}
              onChange={(e) => setCustomAccent(e.target.value)}
              className="w-7 h-7 rounded-lg border border-salon-gray cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="group flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-luxury border border-salon-gray hover:border-salon-rose transition-all hover:scale-105"
        title="Theme Palette Picker"
        aria-label="Theme Palette Picker"
      >
        <div className="flex -space-x-1.5">
          {THEME_PRESETS.slice(0, 3).map((t) => (
            <span
              key={t.id}
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
              style={{ backgroundColor: t.primary }}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-salon-black flex items-center">
          <Palette className="w-3.5 h-3.5 mr-1 text-salon-rose group-hover:rotate-45 transition-transform" />
          Theme
        </span>
      </button>
    </div>
  );
}
