/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
          'daily':'#FDFD96',
          'weekly' : '#ffa164',
          'monthly' : '#2196F3'
        },
        //#2196F3
        fontFamily: {
          bubbleFont: ['bubbleFont'],
          balloonFont: ['balloonFont'],
          fatFont: ['fatFont'],
          fattextFont: ['fattextFont'],
          textFontBase: ['textFontBase']
        }
    }
  },
  plugins: [],
}
