/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "theme-primary": "#8965e4",
        "mentor-theme": "#109104",
      },
      fontFamily: {
        "sentinent-bold": ["sentinent-bold", "sans-serif"],
        "sentinent-light": ["sentinent-light", "sans-serif"],
        "sentinent-medium": ["sentinent-medium", "sans-serif"],
        "sentinent-medium-italic": ["sentinent-medium-italic", "sans-serif"],
        "sentinent-bold-italic": ["sentinent-bold-italic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
