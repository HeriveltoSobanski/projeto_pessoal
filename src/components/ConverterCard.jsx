import React, { useState, useEffect } from "react";

export default function ConverterCard({ type, onResultado }) {
  const [valor, setValor] = useState("");
  const [de, setDe] = useState("");
  const [para, setPara] = useState("");
  const [openDe, setOpenDe] = useState(false);
  const [openPara, setOpenPara] = useState(false);
  const [resultado, setResultado] = useState("");

  const opcoes = {
    moeda: ["R$", "US$", "€"],
    temperatura: ["°C", "°F", "K"],
    distancia: ["km", "m", "cm", "mi"],
    peso: ["kg", "g", "lb"],
    tempo: ["s", "min", "h"],
  };

  function converter() {
    if (!valor || !de || !para) return setResultado("Preencha todos os campos.");
    if (de === para) return setResultado(`Resultado: ${valor} ${para}`);
    setResultado(`Conversão simulada de ${valor} ${de} para ${para}`);
    onResultado(`Conversão simulada de ${valor} ${de} para ${para}`);
  }

  useEffect(() => {
    setValor("");
    setDe("");
    setPara("");
    setResultado("");
  }, [type]);

  return (
    <div className="converter-card">
      <input
        type="number"
        placeholder="Digite o valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <div className="unit-row">
        <div className="unit-col">
          <span className="unit-label">De:</span>
          <div
            className={`select-custom ${openDe ? "open" : ""}`}
            onMouseEnter={() => clearTimeout(window.closeDeTimeout)}
            onMouseLeave={() => (window.closeDeTimeout = setTimeout(() => setOpenDe(false), 200))}
          >
            <div
              className="selected-option"
              onClick={() => setOpenDe((o) => !o)}
            >
              {de || "Selecione"}
              <span className="arrow">▼</span>
            </div>
            {openDe && (
              <ul className="options-list">
                {opcoes[type].map((opt) => (
                  <li
                    key={opt}
                    className={opt === de ? "active" : ""}
                    onClick={() => {
                      setDe(opt);
                      setOpenDe(false);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          className="swap-btn"
          onClick={() => {
            const temp = de;
            setDe(para);
            setPara(temp);
          }}
        >
          ⇄
        </button>

        <div className="unit-col">
          <span className="unit-label">Para:</span>
          <div
            className={`select-custom ${openPara ? "open" : ""}`}
            onMouseEnter={() => clearTimeout(window.closeParaTimeout)}
            onMouseLeave={() => (window.closeParaTimeout = setTimeout(() => setOpenPara(false), 200))}
          >
            <div
              className="selected-option"
              onClick={() => setOpenPara((o) => !o)}
            >
              {para || "Selecione"}
              <span className="arrow">▼</span>
            </div>
            {openPara && (
              <ul className="options-list">
                {opcoes[type].map((opt) => (
                  <li
                    key={opt}
                    className={opt === para ? "active" : ""}
                    onClick={() => {
                      setPara(opt);
                      setOpenPara(false);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <button onClick={converter}>Converter</button>
      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}
