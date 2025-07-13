/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
}
module.exports = {
  theme: {
    extend: {
      boxShadow:{
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
        xxl : '30px',
      },
    },
  },
  plugins: [],
};
