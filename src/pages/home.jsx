import React, { useState } from "react";
import ConverterCard from "../components/ConverterCard";
import "../styles/style.css";

export default function Home() {
  const [type, setType] = useState("moeda");

  const [mensagem, setMensagem] = useState(
    "Escolha o tipo de conversão e insira um valor."
  );

  function handleResultado(resultadoTexto) {
    setMensagem(`Resultado: ${resultadoTexto}`);
  }

  return (
    <div className="home-container">
      <h1>Conversor Universal 🌎</h1>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="select-type"
      >
        <option value="moeda">Moeda</option>
        <option value="temperatura">Temperatura</option>
        <option value="distancia">Distância</option>
        <option value="peso">Peso</option>
        <option value="tempo">Tempo</option>
      </select>

      <ConverterCard type={type} onResultado={handleResultado} />

      <p className="mensagem">{mensagem}</p>
    </div>
  );
}
