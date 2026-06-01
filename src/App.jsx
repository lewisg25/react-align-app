import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import HomePage from "../components/HomePage";
import HowItWorks from "../components/HowItWorks";
import Products from "../components/Products";
import Programs from "../components/Programs";
import Contacts from "../components/Contact";
import Login from "../components/Login";
import Dashboard from "../dashBoard_components/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import VerifyEmail from "../components/VerifyEmail";
import Footer from "../components/Footer";
import "./App.css";
// import AlignDashboard from "../components/AlignDashboard";

function App() {
  return (
    <>
      <Header />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/products" element={<Products />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    
      <Footer />
    </>
  );
}

export default App;
