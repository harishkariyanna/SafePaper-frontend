/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        textcolor: "#050315",
        background: "#fbfbfe",
        primary: "#2f27ce",
        secondary: "#dedcff",
        accent: "#433bff",
      },
    },
  },
  plugins: [],
};
