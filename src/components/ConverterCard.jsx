import React, { useEffect, useMemo, useState } from "react";

const UNITS = {
  temperatura: {
    units: ["C", "F", "K"],
    labels: { C: "°C", F: "°F", K: "K" },
  },
  distancia: {
    units: ["km", "m", "cm", "mi", "ft"],
    factorsToBase: { km: 1000, m: 1, cm: 0.01, mi: 1609.344, ft: 0.3048 },
    labels: { km: "km", m: "m", cm: "cm", mi: "mi", ft: "ft" },
  },
  peso: {
    units: ["kg", "g", "lb", "oz"],
    factorsToBase: { kg: 1000, g: 1, lb: 453.59237, oz: 28.349523125 },
    labels: { kg: "kg", g: "g", lb: "lb", oz: "oz" },
  },
  tempo: {
    units: ["dia", "hora", "min", "s"],
    factorsToBase: { dia: 86400, hora: 3600, min: 60, s: 1 },
    labels: { dia: "dia", hora: "h", min: "min", s: "s" },
  },
  moeda: {
    units: ["BRL", "USD", "EUR"],
    ratesBRL: { BRL: 1, USD: 5.65, EUR: 6.1 },
    labels: { BRL: "R$", USD: "US$", EUR: "€" },
  },
};

const DEFAULT_FROM_TO = {
  temperatura: { from: "C", to: "F" },
  distancia: { from: "km", to: "m" },
  peso: { from: "kg", to: "lb" },
  tempo: { from: "hora", to: "min" },
  moeda: { from: "USD", to: "BRL" },
};

export default function ConverterCard({ type }) {
  const [valor, setValor] = useState("");
  const [from, setFrom] = useState(DEFAULT_FROM_TO[type].from);
  const [to, setTo] = useState(DEFAULT_FROM_TO[type].to);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    setFrom(DEFAULT_FROM_TO[type].from);
    setTo(DEFAULT_FROM_TO[type].to);
    setValor("");
    setResultado(null);
  }, [type]);

  const { units, labels } = useMemo(() => {
    const g = UNITS[type];
    return { units: g.units, labels: g.labels };
  }, [type]);

  function convertTemperature(v, f, t) {
    let c = v;
    if (f === "F") c = ((v - 32) * 5) / 9;
    if (f === "K") c = v - 273.15;
    if (t === "C") return c;
    if (t === "F") return (c * 9) / 5 + 32;
    if (t === "K") return c + 273.15;
    return v;
  }

  function convertLinear(v, factors, f, t) {
    const base = v * factors[f];
    return base / factors[t];
  }

  function convertCurrency(v, ratesBRL, f, t) {
    return v * (ratesBRL[f] / ratesBRL[t]);
  }

  function handleConvert() {
    const n = parseFloat(valor);
    if (isNaN(n)) {
      setResultado("Digite um número válido");
      return;
    }
    if (from === to) {
      setResultado(n);
      return;
    }

    let out = n;

    switch (type) {
      case "temperatura":
        out = convertTemperature(n, from, to);
        break;
      case "distancia":
        out = convertLinear(n, UNITS.distancia.factorsToBase, from, to);
        break;
      case "peso":
        out = convertLinear(n, UNITS.peso.factorsToBase, from, to);
        break;
      case "tempo":
        out = convertLinear(n, UNITS.tempo.factorsToBase, from, to);
        break;
      case "moeda":
        out = convertCurrency(n, UNITS.moeda.ratesBRL, from, to);
        break;
      default:
        break;
    }

    setResultado(out);
  }

  function swap() {
    setFrom(to);
    setTo(from);
    setResultado(null);
  }

  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    return num.toLocaleString("pt-BR", { maximumFractionDigits: 6 });
  };

  return (
    <div className="converter-card">
      <div className="unit-row">
        <div className="unit-col">
          <label className="unit-label">De</label>
          <select className="unit-select" value={from} onChange={(e) => setFrom(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {labels?.[u] || u}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="swap-btn" onClick={swap} title="Inverter">
          ⇄
        </button>

        <div className="unit-col">
          <label className="unit-label">Para</label>
          <select className="unit-select" value={to} onChange={(e) => setTo(e.target.value)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {labels?.[u] || u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <button onClick={handleConvert}>Converter</button>

      {resultado !== null && (
        <p className="resultado">
          Resultado: <span>{formatNumber(resultado)}</span> {labels?.[to] || to}
        </p>
      )}
    </div>
  );
}
