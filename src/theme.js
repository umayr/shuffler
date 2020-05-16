import { deep as theme } from '@theme-ui/presets'

export default {
  ...theme,
  buttons: {
    outline: {
      variant: 'buttons.primary',
      color: 'primary',
      bg: 'transparent',
      border: `1px solid ${theme.colors.primary}`,
    },
    secondary: {
      variant: 'buttons.primary',
      color: 'background',
      bg: 'secondary',
    },
  },
}
