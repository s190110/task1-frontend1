// src/components/Home.js

import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Employee Portal</h1>
      <button
        onClick={() => navigate("/register")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Registration
      </button>
      <button
        onClick={() => navigate("/employees")}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Employee Details
      </button>
    </div>
  );
};

export default Home;
