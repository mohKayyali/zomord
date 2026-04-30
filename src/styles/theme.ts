import { alpha, createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#046A38",
      light: "#0F8F73",
      dark: "#014421",
    },
    secondary: {
      main: "#A8E6CF",
      dark: "#74B89A",
    },
    warning: {
      main: "#D4AF37",
    },
    background: {
      default: "#ffffff",
      paper: "transparent",
    },
    text: {
      primary: "#143626",
      secondary: alpha("#143626", 0.72),
    },
  },
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontFamily: '"IBM Plex Sans Arabic", "Manrope", sans-serif',
    h1: {
      fontFamily: '"Manrope", "IBM Plex Sans Arabic", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontFamily: '"Manrope", "IBM Plex Sans Arabic", sans-serif',
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: '"Manrope", "IBM Plex Sans Arabic", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          backgroundImage: "none",
          border: "none",
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.86),
          borderRadius: 20,
          transition: "border-color 180ms ease, box-shadow 180ms ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#046A38", 0.34),
            borderWidth: 1.5,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#046A38", 0.54),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0F8F73",
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: alpha("#046A38", 0.34),
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: alpha("#143626", 0.68),
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: alpha("#143626", 0.62),
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          color: "#143626",
          borderRadius: 18,
          boxShadow: "0 18px 45px rgba(4, 106, 56, 0.12)",
          border: `1px solid ${alpha("#046A38", 0.12)}`,
        },
        list: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#143626",
          borderRadius: 12,
          margin: "0 8px",
          "&:hover": {
            backgroundColor: alpha("#A8E6CF", 0.24),
          },
          "&.Mui-selected": {
            backgroundColor: alpha("#A8E6CF", 0.34),
          },
          "&.Mui-selected:hover": {
            backgroundColor: alpha("#A8E6CF", 0.42),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: "transparent",
          border: "none",
        },
      },
    },
  },
});
