/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        darkPrimary: "#172554",
        darkSecondary: "#0f172a",
        darkText: "#e2e8f0",
        darkTextSecondary: "#94a3b8",
      },
    },
  },
  plugins: [],
};
