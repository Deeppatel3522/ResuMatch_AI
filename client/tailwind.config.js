/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5F0",
        ink: "#16261E",
        "ink-soft": "#3D4F42",
        highlight: "#C9A227",
        "highlight-soft": "#F0DFA6",
        line: "#D8D3C4",
        good: "#3D7A5E",
        bad: "#B4543A",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
