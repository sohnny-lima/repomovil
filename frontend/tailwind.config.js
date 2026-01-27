/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6200EE',
        secondary: '#03DAC6',
        background: '#F0F0F0',
        surface: '#FFFFFF',
        error: '#B00020',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
        placeholder: '#9E9E9E',
        youtube: '#FF0000',
        drive: '#1FA463',
        onedrive: '#0078D4',
        other: '#607D8B',
      }
    },
  },
  plugins: [],
}
