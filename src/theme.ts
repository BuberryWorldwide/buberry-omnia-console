import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: '"Styrene A Web", "Helvetica Neue", Sans-Serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#8259ef'
    }
  }
});

export type ThemeName = keyof typeof theme; // 'dark' | 'light' | 'retro'
