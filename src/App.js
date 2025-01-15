import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Header } from './components/Header';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Signup from './components/Auth/Signup';
import { Provider } from 'react-redux';
import rootReducers from './components/Store/rootReducers'


function App() {

  axios.interceptors.request.use((req) => {
    req.headers['Authorization'] = `Bearer ${localStorage.getItem('jwt_token')}`;
    req.headers['Content-Type'] = 'application/json';
    return req;
  });


  axios.interceptors.response.use(response => {
    if (localStorage.getItem('jwt_token') !== null && localStorage.getItem('jwt_token') !== undefined) {
      if (response.headers.hasOwnProperty("authorization")) {
        const validToken = response.headers.authorization;
        if (validToken !== 'NaN' && validToken !== null && validToken !== undefined) {
          const newToken = response.headers.authorization.replace('Bearer', '').trim();
          if (localStorage.getItem('jwt_token') !== newToken) {
            localStorage.setItem('jwt_token', newToken);
          }
        }
      }
    }
    return response;

  }, error => {
    if (error.response.status === 401) {
      window.location = `${window.location.origin}`;
      localStorage.removeItem('jwt_token')


    }
    return error;
  });


  return (
    <Provider store={rootReducers}>
      <Router>
        <div className="App" style={{ height: '100%' }}>
          <Header />

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>

        </div>
      </Router>
    </Provider>
  );
}

export default App;
