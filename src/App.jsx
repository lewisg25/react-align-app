import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
import HomePage from "../components/HomePage";
import HowItWorks from "../components/HowItWorks";
import Products from "../components/Products";
import Programs from "../components/Programs";
import Contacts from "../components/Contact";
import Reviews from "../components/Reviews";
import Login from "../components/Login";
import AlignmentResults from "../components/AlignmentResults";
import Dashboard from "../dashBoard_components/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Footer from "../components/Footer";
import BalatroBackground from "./BalatroBackground";

function App() {
  return (
    <>
      <BalatroBackground />
      <div className="app-shell">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/products" element={<Products />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <AlignmentResults />
              </ProtectedRoute>
            }
          />
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
      </div>
    </>
  );
}

export default App;
