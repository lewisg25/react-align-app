import { Routes, Route } from "react-router-dom";

import Header from "../components/Header";
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
import OAuthCallback from "../components/OAuthCallback";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/products" element={<Products />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
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
