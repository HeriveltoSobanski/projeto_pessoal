import React, { useState, useEffect } from "react";

export default function ConverterCard({ type, onResultado }) {
  const [valor, setValor] = useState("");
  const [de, setDe] = useState("");
  const [para, setPara] = useState("");
  const [openDe, setOpenDe] = useState(false);
  const [openPara, setOpenPara] = useState(false);
  const [resultado, setResultado] = useState("");
  const [rates, setRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState("");

  const opcoes = {
    moeda: ["R$", "US$", "€"],
    temperatura: ["°C", "°F", "K"],
    distancia: ["km", "m", "cm", "mi"],
    peso: ["kg", "g", "lb"],
    tempo: ["s", "min", "h"],
  };

  const CODE = { "R$": "BRL", "US$": "USD", "€": "EUR" };

  useEffect(() => {
    setValor("");
    setDe("");
    setPara("");
    setResultado("");
    setRatesError("");
    if (type === "moeda") {
      loadRates();
    }
  }, [type]);

  async function loadRates() {
    try {
      setLoadingRates(true);
      setRatesError("");
      // Base EUR, pegando USD e BRL (EUR é 1).
      const r = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,BRL");
      const data = await r.json();
      // Estrutura: { EUR:1, USD:x, BRL:y }
      setRates({ EUR: 1, USD: data.rates?.USD, BRL: data.rates?.BRL });
    } catch (e) {
      setRatesError("Falha ao buscar cotações. Tente novamente.");
      setRates(null);
    } finally {
      setLoadingRates(false);
    }
  }

  function convertCurrency(amount, fromSym, toSym) {
    if (!rates) return null;
    const from = CODE[fromSym];
    const to = CODE[toSym];
    if (!from || !to) return null;
    // Converte para EUR e depois para a moeda destino.
    const amountInEUR = amount / rates[from];
    return amountInEUR * rates[to];
  }

  function convertTemperature(n, f, t) {
    const key = `${f}->${t}`;
    switch (key) {
      case "°C->°F": return (n * 9) / 5 + 32;
      case "°F->°C": return ((n - 32) * 5) / 9;
      case "°C->K":  return n + 273.15;
      case "K->°C":  return n - 273.15;
      case "°F->K":  return ((n - 32) * 5) / 9 + 273.15;
      case "K->°F":  return ((n - 273.15) * 9) / 5 + 32;
      default:       return n;
    }
  }

  function convertLinear(n, factors, f, t) {
    // Para unidade base
    const toBase = n * factors[f];
    // Da base para destino
    return toBase / factors[t];
  }

  const FACTORS = {
    distancia: { km: 1000, m: 1, cm: 0.01, mi: 1609.344 },
    peso: { kg: 1, g: 0.001, lb: 0.45359237 },
    tempo: { s: 1, min: 60, h: 3600 },
  };

  function formatNumber(n) {
    return n.toLocaleString("pt-BR", { maximumFractionDigits: 4 });
  }

  function converter() {
    if (!valor || !de || !para) {
      setResultado("Preencha todos os campos.");
      onResultado?.("Preencha todos os campos.");
      return;
    }

    const n = parseFloat(valor);
    if (isNaN(n)) {
      setResultado("Digite um número válido.");
      onResultado?.("Digite um número válido.");
      return;
    }

    if (de === para) {
      const txt = `Resultado: ${formatNumber(n)} ${para}`;
      setResultado(txt);
      onResultado?.(txt);
      return;
    }

    let out = null;
    let txt = "";

    if (type === "moeda") {
      if (loadingRates) {
        setResultado("Carregando cotações…");
        onResultado?.("Carregando cotações…");
        return;
      }
      if (ratesError || !rates) {
        setResultado(ratesError || "Sem cotações disponíveis.");
        onResultado?.(ratesError || "Sem cotações disponíveis.");
        return;
      }
      out = convertCurrency(n, de, para);
      if (out == null) {
        setResultado("Conversão indisponível.");
        onResultado?.("Conversão indisponível.");
        return;
      }
      txt = `Conversão de ${formatNumber(n)} ${de} para ${para}: ${formatNumber(out)} ${para}`;
    } else if (type === "temperatura") {
      out = convertTemperature(n, de, para);
      txt = `${formatNumber(n)} ${de} = ${formatNumber(out)} ${para}`;
    } else if (type === "distancia") {
      out = convertLinear(n, FACTORS.distancia, de, para);
      txt = `${formatNumber(n)} ${de} = ${formatNumber(out)} ${para}`;
    } else if (type === "peso") {
      out = convertLinear(n, FACTORS.peso, de, para);
      txt = `${formatNumber(n)} ${de} = ${formatNumber(out)} ${para}`;
    } else if (type === "tempo") {
      out = convertLinear(n, FACTORS.tempo, de, para);
      txt = `${formatNumber(n)} ${de} = ${formatNumber(out)} ${para}`;
    } else {
      txt = "Tipo de conversão não suportado.";
    }

    setResultado(txt);
    onResultado?.(txt);
  }

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
            <div className="selected-option" onClick={() => setOpenDe((o) => !o)}>
              {de || "Selecione"} <span className="arrow">▼</span>
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
            const t = de;
            setDe(para);
            setPara(t);
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
            <div className="selected-option" onClick={() => setOpenPara((o) => !o)}>
              {para || "Selecione"} <span className="arrow">▼</span>
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

      <button onClick={converter} disabled={type === "moeda" && loadingRates}>
        {type === "moeda" && loadingRates ? "Carregando cotações…" : "Converter"}
      </button>

      {resultado && <p className="resultado">{resultado}</p>}
    </div>
  );
}
