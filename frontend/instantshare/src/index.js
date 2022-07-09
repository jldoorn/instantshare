import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Board from './routes/Board';
import { GeistProvider, CssBaseline } from '@geist-ui/core';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GeistProvider>
    <CssBaseline />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:boardId" element={<Board /> } />
    </Routes>
  </BrowserRouter>
  </GeistProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
