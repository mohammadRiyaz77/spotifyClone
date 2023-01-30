/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {
        colors:{
          "green":"#1db954",
          "black-primary":"#191414",
          "primary":"#FFFFFF",
          "light-black":"#282828",
          "secondary":"#b3b3b3b",
          "gray":"#535353",
          "black-secondary":"#171818",
          "black-base":"#121212"
         
        },
        gridTemplateColumns:{
          'auto-fill-cards':'repeat(auto-fill,minmax(200px,1fr))'
        },
      },
    },
    plugins: [require('@tailwindcss/line-clamp'),],
  }