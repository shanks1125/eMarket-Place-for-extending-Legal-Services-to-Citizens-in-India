import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Blog from "./Pages/Blog";
import AdminDashboard from "./Pages/AdminDashboard";
// import other pages as needed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
