import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00FF00", // Bright green
    },
    secondary: {
      main: "#FFA500", // Orange
    },
    background: {
      default: "#000000", // Black
      paper: "#101010", // Dark gray
    },
    text: {
      primary: "#00FF00", // Bright green text
      secondary: "#00CCCC", // Cyan text
    },
  },
  typography: {
    fontFamily: "Courier New, Courier, monospace",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#101010", // Dark button background
          color: "#00FF00", // Green text
          border: "1px solid #00FF00", // Green border
          padding: "10px 20px",
          borderRadius: "4px",
          fontSize: "12px",
          fontFamily: "Courier New, Courier, monospace",
          transition: "transform 0.3s, background 0.3s",
          "&:hover": {
            backgroundColor: "#202020", // Slightly brighter background on hover
            transform: "scale(1.05)", // Hover effect
          },
          "&:disabled": {
            backgroundColor: "#303030", // Disabled background
            color: "#555555", // Disabled text color
            cursor: "not-allowed",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard", // Apply underline-only style
      },
      styleOverrides: {
        root: {
          "& .MuiInput-underline:before": {
            borderBottom: "1px dashed rgba(255, 255, 255, 0.5)", // Dashed translucent underline
          },
          "& .MuiInput-underline:hover:before": {
            borderBottom: "1px dashed rgba(160, 160, 160, 0.8)", // Slightly brighter on hover
          },
          "& .MuiInput-underline:after": {
            borderBottom: "1.5px solid rgb(0, 184, 40)", // Solid border on focus
          },
          "& .MuiInputBase-input": {
            color: "#00FF00", // Text color inside the input
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 255, 213, 0.7)", // Translucent label
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#00FF00", // Bright green when focused
          },
        },
      },
    },
  },
});
export default theme;