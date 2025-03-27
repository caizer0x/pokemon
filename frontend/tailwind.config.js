/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3c5aa6",
        secondary: "#ffcb05",
        dark: "#2a75bb",
        light: "#e6f0ff",
        danger: "#ff5959",
        success: "#78c850",
        warning: "#f8d030",
      },
    },
  },
  plugins: [],
};
