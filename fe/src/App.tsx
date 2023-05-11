import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Routes, Route} from 'react-router-dom';
/* MUI Core Components */
import { Button } from '@mui/material';
import { ThemeProvider } from "@mui/material";

/* MUI Italia theme */
import { theme } from "@pagopa/mui-italia";


function App() {
  return (
    
    <ThemeProvider theme={theme}>
      <div className="App">
        <Button variant="contained">Hello World</Button>
        <Routes>
        <Route path='/' element={<div>test</div>}/>
    </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
