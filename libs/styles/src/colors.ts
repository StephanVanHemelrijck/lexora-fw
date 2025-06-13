export const Colors = {
  main: '#242933',
  textDark: '#262626',
  textDarker: '#191919',
  textLight: '#F6F0E9',
  accent: '#C5A4E7',
  actionButton: '#66BB6A',
  navigation: '#4267B2',
  inputBackground: 'rgba(0, 0, 0, 0.15)',

  // 🆕 Added variants for component styling
  surface: '#2f3541', // background of options
  border: '#4a4f5c', // border around each option
  highlight: '#66BB6A', // selected background (reusing actionButton)
  highlightDark: '#4e9c53', // darker variant of selected background
  disabled: '#4a4f5c', // text color for disabled options

  //
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
  success: '#4caf50',
} as const;
