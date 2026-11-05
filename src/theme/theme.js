import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4F46E5',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#24292F',
      secondary: '#656D76',
    },
    divider: '#D0D7DE',
    success: {
      main: '#16A34A',
    },
    error: {
      main: '#DC2626',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#24292F',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#24292F',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#24292F',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#24292F',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.5,
      color: '#24292F',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
      color: '#656D76',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          borderColor: '#D0D7DE',
          boxShadow: '0 1px 3px rgba(31, 35, 40, 0.04)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;

