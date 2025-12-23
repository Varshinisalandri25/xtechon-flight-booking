/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#020617",
        sky: "#0EA5E9",
        silver: "#CBD5E1",
        success: "#22C55E",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
