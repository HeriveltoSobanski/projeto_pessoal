import React, { useState, useEffect } from "react";
import ConverterCard from "../components/ConverterCard";
import "../styles/style.css";

export default function Home() {
  const [type, setType] = useState("moeda");
  const [theme, setTheme] = useState("light");
  const [openSelect, setOpenSelect] = useState(false);

  const tipos = ["moeda", "temperatura", "distancia", "peso", "tempo"];

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    document.body.setAttribute("data-theme", saved || "light");
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <div className="home-container">
      <div className="theme-toggle" onClick={toggleTheme}>
        <div className={`switch ${theme}`}>
          <span className="icon">{theme === "light" ? "🌞" : "🌙"}</span>
        </div>
        <span className="label">
          {theme === "light" ? "Modo Claro" : "Modo Escuro"}
        </span>
      </div>

      <h1>Conversor Universal</h1>

      {/* Seletor Customizado */}
      <div
        className={`select-custom ${openSelect ? "open" : ""}`}
        onMouseEnter={() => clearTimeout(window.closeTipoTimeout)}
        onMouseLeave={() => (window.closeTipoTimeout = setTimeout(() => setOpenSelect(false), 200))}
      >
        <div
          className="selected-option"
          onClick={() => setOpenSelect((o) => !o)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
          <span className="arrow">▼</span>
        </div>

        {openSelect && (
          <ul className="options-list">
            {tipos.map((opt) => (
              <li
                key={opt}
                className={opt === type ? "active" : ""}
                onClick={() => {
                  setType(opt);
                  setOpenSelect(false);
                }}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConverterCard type={type} onResultado={() => {}} />
    </div>
  );
}
