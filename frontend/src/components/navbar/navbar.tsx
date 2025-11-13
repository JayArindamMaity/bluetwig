import { useState, useEffect } from "react";
import "./navbar.css";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { FaHome, FaPalette } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "blue-dark";
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("theme", theme);
  }, [theme]);

  const themes = [
    { name: "orange-dark", color: "#ff9100" },
    { name: "yellow-dark", color: "#ffd500" },
    { name: "red-dark", color: "#ff4f4f" },
  ];

  return (
    <nav className="nav-main">
      <ul className="nav-list">

        <li><Link to="/"><FaHome /></Link></li>
        <li><Link to="/leetcode"><SiLeetcode /></Link></li>
        <li><Link to="/codeforces"><SiCodeforces /></Link></li>
        <li><Link to="/codechef"><SiCodechef /></Link></li>


        <li className="theme-toggle">
          <button
            className="theme-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaPalette />
          </button>

          {dropdownOpen && (
            <div className="theme-dropdown">
              {themes.map((t) => (
                <div
                  key={t.name}
                  className={`theme-swatch ${theme === t.name ? "active" : ""}`}
                  style={{ backgroundColor: t.color }}
                  onClick={() => {
                    setTheme(t.name);
                    setDropdownOpen(false);
                  }}
                ></div>
              ))}
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
