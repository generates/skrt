import { colors } from 'tailwindcss/defaultTheme'

export default {
  purge: false,
  theme: {
    corePlugins: {
      container: false
    },
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue
    }
  },
  variants: {},
  plugins: [
    // require('@tailwindcss/typography')
  ]
}
