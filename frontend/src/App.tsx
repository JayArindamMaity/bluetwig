import "./App.css";
import Home from "./pages/home/home";
import Navbar from "./components/navbar/navbar";
import Leetcode from "./pages/leetcode/leetcode";
// import Footer from "./components/footer/footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="page-container">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leetcode" element={<Leetcode />} />
          </Routes>
        </div>

        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
