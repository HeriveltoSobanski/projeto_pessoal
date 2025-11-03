function handleConvert() {
  const n = parseFloat(valor);

  if (isNaN(n)) {
    setResultado("Digite um número válido");
    if (typeof onResultado === "function") onResultado("Digite um número válido");
    return;
  }

  if (from === to) {
    setResultado(n);
    if (typeof onResultado === "function")
      onResultado(`${formatNumber(n)} ${labels?.[to] || to}`);
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

  if (typeof onResultado === "function") {
    onResultado(`${formatNumber(out)} ${labels?.[to] || to}`);
  }
}
