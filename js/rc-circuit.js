// RC Circuit Analyzer: time constant, cutoff frequency, charge/discharge graph.
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var POINTS = 100;

  var els = {
    rValue: document.getElementById("r-value"),
    rUnit: document.getElementById("r-unit"),
    cValue: document.getElementById("c-value"),
    cUnit: document.getElementById("c-unit"),
    vValue: document.getElementById("v-value"),
    error: document.getElementById("error"),
    results: document.getElementById("results"),
    tau: document.getElementById("out-tau"),
    fc: document.getElementById("out-fc"),
    graph: document.getElementById("graph"),
    explanation: document.getElementById("explanation")
  };

  // Show a number with 4 significant digits and no trailing zeros.
  function trim(n) {
    return String(parseFloat(n.toPrecision(4)));
  }

  // Pick the unit that keeps the number readable, e.g. 0.001 s -> "1 ms".
  function withUnit(value, units) {
    for (var i = 0; i < units.length; i++) {
      if (value >= units[i][0] || i === units.length - 1) {
        return trim(value / units[i][0]) + " " + units[i][1];
      }
    }
  }

  var TIME_UNITS = [[1, "s"], [1e-3, "ms"], [1e-6, "µs"], [1e-9, "ns"], [1e-12, "ps"]];
  var FREQ_UNITS = [[1e9, "GHz"], [1e6, "MHz"], [1e3, "kHz"], [1, "Hz"], [1e-3, "mHz"]];

  function formatTime(s) { return withUnit(s, TIME_UNITS); }
  function formatFreq(hz) { return withUnit(hz, FREQ_UNITS); }
  function formatVolts(v) { return trim(v) + " V"; }

  function svgEl(name, attrs, text) {
    var el = document.createElementNS(SVG_NS, name);
    for (var key in attrs) el.setAttribute(key, attrs[key]);
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function drawGraph(tau, vs) {
    var W = 600, H = 320;
    var left = 68, right = 24, top = 20, bottom = 50;
    var plotW = W - left - right, plotH = H - top - bottom;
    var tMax = 5 * tau;

    function x(t) { return left + (t / tMax) * plotW; }
    function y(v) { return top + plotH - (v / vs) * plotH; }

    var g = els.graph;
    while (g.firstChild) g.removeChild(g.firstChild);

    // Dashed guide lines at 63.2% and 36.8% of the source voltage, and at t = tau.
    var v63 = vs * (1 - Math.exp(-1));
    var v37 = vs * Math.exp(-1);
    [v63, v37].forEach(function (v) {
      g.appendChild(svgEl("line", { x1: left, y1: y(v), x2: left + plotW, y2: y(v), "class": "graph-guide" }));
    });
    g.appendChild(svgEl("line", { x1: x(tau), y1: top, x2: x(tau), y2: top + plotH, "class": "graph-guide" }));

    // Axes.
    g.appendChild(svgEl("line", { x1: left, y1: top, x2: left, y2: top + plotH, "class": "graph-axis" }));
    g.appendChild(svgEl("line", { x1: left, y1: top + plotH, x2: left + plotW, y2: top + plotH, "class": "graph-axis" }));

    // Time ticks at 0, 1, 2, 3, 4, 5 tau.
    for (var k = 0; k <= 5; k++) {
      var tx = x(k * tau);
      g.appendChild(svgEl("line", { x1: tx, y1: top + plotH, x2: tx, y2: top + plotH + 5, "class": "graph-axis" }));
      g.appendChild(svgEl("text", { x: tx, y: top + plotH + 22, "text-anchor": "middle", "class": "graph-text" },
        k === 0 ? "0" : k + "τ"));
    }
    g.appendChild(svgEl("text", { x: left + plotW / 2, y: H - 8, "text-anchor": "middle", "class": "graph-text" },
      "Time (τ = " + formatTime(tau) + ")"));

    // Voltage labels: 0, 36.8%, 63.2%, 100%.
    [[0, "0 V"], [v37, "36.8%"], [v63, "63.2%"], [vs, formatVolts(vs)]].forEach(function (p) {
      g.appendChild(svgEl("text", { x: left - 6, y: y(p[0]) + 4, "text-anchor": "end", "class": "graph-text" }, p[1]));
    });

    // Curves.
    var charge = [], discharge = [];
    for (var i = 0; i <= POINTS; i++) {
      var t = (i / POINTS) * tMax;
      var e = Math.exp(-t / tau);
      charge.push(x(t).toFixed(1) + "," + y(vs * (1 - e)).toFixed(1));
      discharge.push(x(t).toFixed(1) + "," + y(vs * e).toFixed(1));
    }
    g.appendChild(svgEl("polyline", { points: charge.join(" "), "class": "graph-charge" }));
    g.appendChild(svgEl("polyline", { points: discharge.join(" "), "class": "graph-discharge" }));

    // Legend, in the empty middle-right of the plot.
    var lx = left + plotW - 190, ly = top + plotH / 2;
    g.appendChild(svgEl("line", { x1: lx, y1: ly - 5, x2: lx + 28, y2: ly - 5, "class": "graph-charge" }));
    g.appendChild(svgEl("text", { x: lx + 36, y: ly, "class": "graph-text" }, "Charging"));
    g.appendChild(svgEl("line", { x1: lx, y1: ly + 21, x2: lx + 28, y2: ly + 21, "class": "graph-discharge" }));
    g.appendChild(svgEl("text", { x: lx + 36, y: ly + 26, "class": "graph-text" }, "Discharging"));
  }

  function showExplanation(tau, fc, vs) {
    var v63 = vs * (1 - Math.exp(-1));
    var v37 = vs * Math.exp(-1);
    els.explanation.innerHTML = "";
    [
      "The time constant τ (tau) is R × C. It tells you how fast the capacitor charges or discharges. " +
        "While charging, the capacitor reaches about 63.2% of the source voltage (" + formatVolts(v63) +
        ") after one τ, which is " + formatTime(tau) + ".",
      "After 5τ (" + formatTime(5 * tau) + ") it is about 99.3% charged, so engineers usually call it fully charged.",
      "Discharging is the mirror image: after one τ the voltage has dropped to about 36.8% (" + formatVolts(v37) + ").",
      "The cutoff frequency (fc) is " + formatFreq(fc) + ". If you use this resistor and capacitor as a low-pass filter, " +
        "signals below this frequency pass through almost unchanged, and signals above it get weaker."
    ].forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      els.explanation.appendChild(p);
    });
  }

  function showError(message) {
    els.error.textContent = message;
    els.error.hidden = false;
    els.results.hidden = true;
  }

  function update() {
    var r = parseFloat(els.rValue.value) * parseFloat(els.rUnit.value);
    var c = parseFloat(els.cValue.value) * parseFloat(els.cUnit.value);
    var vs = parseFloat(els.vValue.value);

    if (!isFinite(r) || r <= 0) return showError("Enter a resistance greater than 0.");
    if (!isFinite(c) || c <= 0) return showError("Enter a capacitance greater than 0.");
    if (!isFinite(vs) || vs <= 0) return showError("Enter a source voltage greater than 0.");

    var tau = r * c;
    var fc = 1 / (2 * Math.PI * tau);

    els.error.hidden = true;
    els.results.hidden = false;
    els.tau.textContent = formatTime(tau);
    els.fc.textContent = formatFreq(fc);
    drawGraph(tau, vs);
    showExplanation(tau, fc, vs);
  }

  document.getElementById("rc-form").addEventListener("input", update);
  document.getElementById("rc-form").addEventListener("submit", function (e) { e.preventDefault(); });
  update();
})();
