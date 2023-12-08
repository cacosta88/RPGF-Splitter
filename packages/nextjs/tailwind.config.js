/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // Updated DaisyUI theme colors
  daisyui: {
    themes: [
      {
        // Modernized color scheme
        scaffoldEth: {
          primary: "#4ECCA3", // Fresh mint green
          "primary-content": "#1E1E1E", // Darker content color for contrast
          secondary: "#FFC107", // Vibrant amber
          "secondary-content": "#1E1E1E",
          accent: "#FF5722", // Deep orange
          "accent-content": "#FFFFFF",
          neutral: "#1E1E1E",
          "neutral-content": "#F5F5F5",
          "base-100": "#FFFFFF",
          "base-200": "#F0F0F0",
          "base-300": "#E0E0E0",
          "base-content": "#1E1E1E",
          info: "#2196F3", // Bright blue
          success: "#4CAF50", // Rich green
          warning: "#FFC107", // Amber
          error: "#F44336", // Vivid red

          "--rounded-btn": "0.5rem", // Less rounded buttons for a modern look

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
        },
      },
      // Additional themes can be modernized similarly
    ],
  },
  theme: {
    extend: {
      // New color palette
      colors: {
        new_primary: "#3A506B", // Cool blue-grey
        new_secondary: "#5BC0BE", // Soft turquoise
        new_tertiary: "#FFD166", // Warm yellow
      },
      backgroundColor: {
        gradient: "linear-gradient(225deg, #3A506B 0%, #0B132B 100%)", // Deep blue gradient
      },
      fontFamily: {
        "inter": ["Inter", "sans-serif"], // Modern, versatile font
      },
      boxShadow: {
        center: "0 4px 14px 0 rgba(0, 0, 0, 0.15)", // More prominent shadow for depth
      },
      keyframes: {
        slide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        slide: "slide 0.5s ease-out", // Smooth slide-in effect
      },
    },
  },
};
