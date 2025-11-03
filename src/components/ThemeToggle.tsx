"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@once-ui-system/core";

// Simple icon components for light/dark mode
const SunIcon = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  // Initialize theme on mount
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setCurrentTheme(savedTheme);
    root.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update state and storage
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update DOM
    root.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <Button
        size="s"
        aria-label="Toggle theme"
        disabled
        className="h-9 w-9 p-0"
      >
        <SunIcon />
      </Button>
    );
  }

  const isDark = currentTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? MoonIcon : SunIcon;

  return (
    <Button
      size="s"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      className="h-9 w-9 p-0 hover:bg-transparent hover:opacity-80"
    >
      <Icon />
    </Button>
  );
};
