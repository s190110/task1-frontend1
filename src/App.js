// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import EmployeeDetails from "./components/EmployeeDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<EmployeeForm />} />

        <Route path="/employees" element={<EmployeeList />} />

        <Route path="/employees/:id" element={<EmployeeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
