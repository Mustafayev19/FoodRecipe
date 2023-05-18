/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontSize: {
      sms: "0.5rem",
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    fontFamily: {
      mainFont: ['Gemunu Libre'],
      secondFont: ['Kanit', 'sans-serif']
    },
    screens: {

      'sms': '400px',

      'smsx': '500px',

      'sm': '640px',

      'md': '768px',

      'mds': '820px',

      'mdx': '960px',

      'lg': '1024px',

      'xl': '1280px',

      '2xl': '1536px'

    },
    extend: {
      colors: {
        'colorform': '#394867',
        'color1': '#219F94',
        'color2': '#C1DEAE',
        'color3': '#F2F5C8',
        'color4': '#E8E8A6',
        'green2': '#6fffe9ff',
        'white1': '#fbfffe'
      },
      fontSize: {
        xs: '0.3rem',
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      }
    },
  },
  plugins: [],
}


