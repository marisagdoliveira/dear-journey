/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: '500px',  // Custom breakpoint for extra small devices (mobile phones)
      sm: '510px',
      md: '768px',
      lg: '1024px',
      xl: '1920px',
    },
    extend: {
      fontSize: {
        '2xl': '1.5rem', // Adjust based on your design requirements
        '3xl': '1.75rem', // adding more sizes if needed'3xl': '1.75rem', // adding more sizes if needed
      },
      fontFamily: {
        vibur: ["Vibur", 'cursive'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
