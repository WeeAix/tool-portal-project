// Light is the default. The saved choice (if any) is applied right away
// so the page doesn't flash the wrong theme.
(function () {
  var theme = "light";
  try {
    if (localStorage.getItem("theme") === "dark") theme = "dark";
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", theme);

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    function update() {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      button.textContent = dark ? "Switch to light theme" : "Switch to dark theme";
    }

    button.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      update();
    });

    update();
  });
})();
