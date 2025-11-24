// weather.js — shared header weather for Course Book

window.initHeaderWeather = function () {
  const pill   = document.getElementById("headerWeather");
  const tempEl = document.getElementById("weatherTemp");
  const descEl = document.getElementById("weatherDesc");

  if (!pill || !tempEl || !descEl) {
    // Header not injected yet
    return;
  }

  if (!navigator.geolocation) {
    descEl.textContent = "Location unavailable";
    return;
  }

  descEl.textContent = "Locating…";

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + lat +
        "&longitude=" + lon +
        "&current=temperature_2m,weather_code,wind_speed_10m" +
        "&temperature_unit=fahrenheit" +
        "&wind_speed_unit=mph" +
        "&timezone=auto";

      fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.current) {
            descEl.textContent = "Weather unavailable";
            return;
          }

          const current = data.current;
          const t   = Math.round(current.temperature_2m);
          const w   = Math.round(current.wind_speed_10m || 0);
          const txt = codeToText(current.weather_code);

          tempEl.textContent = t + "°F";
          descEl.textContent = txt + (w ? " · " + w + " mph" : "");
        })
        .catch(function () {
          descEl.textContent = "Weather error";
        });
    },
    function () {
      descEl.textContent = "Location denied";
    },
    { enableHighAccuracy: true, maximumAge: 600000, timeout: 10000 }
  );
};

function codeToText(code) {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rain";
  if (code === 66 || code === 67) return "Freezing rain";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 77) return "Snow grains";
  if (code === 80 || code === 81 || code === 82) return "Showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code === 95) return "Storms";
  if (code === 96 || code === 99) return "Storms / hail";
  return "Conditions";
}
