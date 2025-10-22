import "./App.css";
import Home from "./pages/home/home";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="page-container">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App; 