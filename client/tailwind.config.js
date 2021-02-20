const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const defaultConfig = require('tailwindcss/defaultConfig')

const gray = colors.blueGray
const blue = colors.lightBlue

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },

  purge: {
    layers: ['components', 'utilities'],
    content: ['./src/**/*.tsx', './src/**/*.ts'],
  },

  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      borderColor: (theme) => ({
        default: theme('colors.gray.200'),
      }),
      colors: {
        gray,
        blue,
        content: {
          primary: gray['800'],
          secondary: gray['600'],
          tertiary: gray['400'],
        },
        brand: {
          light: blue['50'],
          primary: blue['500'],
          dark: blue['900'],
        },
        background: {
          primary: gray['50'],
          secondary: gray['100'],
          tertiary: gray['200'],
        },
      },
      fontSize: {
        xxs: '0.65rem',
      },
      spacing: {
        0.5: '0.125rem',
        120: '30rem',
      },
    },
  },

  variants: { ...defaultConfig.variants, visibility: ['group-hover'] },
}
