import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Admin from './components/Admin';
import Register from './components/Register'
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path='/regsiter' element={<Register/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
