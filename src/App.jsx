import React, {useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Products from "../components/Products"
import Contacts from "../components/Contact";
import Programs from "../components/Programs"
import GetStarted from "../components/GetStarted";
import Login from "../components/Login"
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage";
import "./App.css";
import SocialLinks from "../components/Footer";

function App () {
  const [serverStatus, setServerStatus] = useState("Connecting to server...");

  useEffect(() => {
 
    fetch("http://localhost:5000/health") 
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend says:", data);
        setServerStatus(`Server is ${data.status} as of ${data.date}`);
      })
      .catch((err) => {
        console.error("Connection error:", err);
        setServerStatus("Failed to connect to backend.");
      });
  }, []);
   return (
    <>
<Navbar />
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/products" element={<Products />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </>
  );
}
    {/* <Navbar  />
      <Header />
      <HomePage/>
      <Programs />
      <HowItWorks />
      <Products />
      <GetStarted />
      <Contacts />
      <Login />
      <Footer />
    </>
  );
} */}
 


export default App;
