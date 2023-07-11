import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from "react-redux"
import authReducer from './state/index'


const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})

const store = configureStore({
  reducer: authReducer
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode >
);
