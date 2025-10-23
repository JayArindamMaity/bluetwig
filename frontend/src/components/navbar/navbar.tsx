import { useState, useEffect } from "react";
import "./navbar.css";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { FaHome } from "react-icons/fa";
import { FaPalette } from "react-icons/fa";

export default function Navbar() {
  const [theme, setTheme] = useState("blue-dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const themes = [
    { name: "blue-dark", color: "#00aaff" },
    { name: "orange-dark", color: "#ff9100" },
    { name: "purple-dark", color: "#b26bff" },
    { name: "red-dark", color: "#ff4f4f" },
  ];

  return (
    <nav className="nav-main">
      <ul className="nav-list">
        <li><a href="#"><FaHome /></a></li>
        <li><a href="/leetcode"><SiLeetcode /></a></li>
        <li><a href="#"><SiCodeforces /></a></li>
        <li><a href="#"><SiCodechef /></a></li>

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
                  className={`theme-swatch ${
                    theme === t.name ? "active" : ""
                  }`}
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
