const API_BASE = "https://www.fuel-prices.eu/lang/api/country-history.php?cc=";

const COUNTRIES = [
  { code: "NL", name: "Nederland", flag: "🇳🇱" },
  { code: "BE", name: "België", flag: "🇧🇪" },
  { code: "DE", name: "Duitsland", flag: "🇩🇪" }
];

const $ = (id) => document.getElementById(id);

const euro = (value) => new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
}).format(value);

let records = [];
let installPrompt = null;

function selectedFuel() {
  const value = ($("fuel")?.value || "sp95").toLowerCase();

  if (["sp95", "e95", "euro95"].includes(value)) return "e95";
  if (value === "diesel") return "diesel";

  return value;
}

function render() {
  const fuel = selectedFuel();
  const supported = fuel === "e95" || fuel === "diesel";

  const list = supported
    ? records.filter((item) => Number.isFinite(item.price))
    : [];

  const sort = $("sort")?.value || "price";

  list.sort((a, b) =>
    sort === "date"
      ? b.date.localeCompare(a.date)
      : a.price - b.price
  );

  if ($("count")) {
    $("count").textContent = String(list.length);
  }

  if ($("best")) {
    $("best").textContent = list.length
      ? euro(list[0].price)
      : "—";
  }

  if ($("date")) {
    const newest = list.map((item) => item.date).sort().at(-1);

    $("date").textContent = newest
      ? new Date(`${newest}T12:00:00`).toLocaleDateString("nl-NL")
      : "onbekend";
  }

  if ($("rows")) {
    if (!supported) {
      $("rows").innerHTML =
        '<tr><td colspan="4">Deze gratis gegevensbron bevat momenteel alleen Euro 95 en diesel.</td></tr>';
    } else if (!list.length) {
      $("rows").innerHTML =
        '<tr><td colspan="4">Geen prijzen beschikbaar.</td></tr>';
    } else {
      $("rows").innerHTML = list.map((item, index) =>
        `<tr>
          <td class="rank">${index + 1}</td>
          <td class="country">${item.flag} ${item.name}
            <span class="sub">${item.code}</span>
          </td>
          <td>${new Date(`${item.date}T12:00:00`).toLocaleDateString("nl-NL")}</td>
          <td>${euro(item.price)}</td>
        </tr>`
      ).join("");
    }
  }

  if ($("status") && supported && list.length) {
    $("status").textContent =
      "Weekprijzen geladen. Dit zijn landelijke gemiddelden, geen actuele pompprijzen.";

    $("status").classList.remove("error");
  }

  calculate();
}

async function load() {
  if ($("status")) {
    $("status").textContent =
      "Gratis weekprijzen ophalen voor Nederland, België en Duitsland…";

    $("status").classList.remove("error");
  }

  if ($("refresh")) {
    $("refresh").disabled = true;
  }

  try {
    const responses = await Promise.all(
      COUNTRIES.map(async (country) => {
        const response = await fetch(
          API_BASE + country.code,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`${country.name}: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (
          !Array.isArray(data.labels) ||
          !Array.isArray(data.e95) ||
          !Array.isArray(data.diesel)
        ) {
          throw new Error(
            `Onverwacht gegevensformaat voor ${country.name}`
          );
        }

        return { country, data };
      })
    );

    records = [];

    for (const { country, data } of responses) {
      const fuel = selectedFuel();
      const key = fuel === "diesel" ? "diesel" : "e95";
      const prices = data[key];

      let latest = null;

      for (
        let i = 0;
        i < Math.min(data.labels.length, prices.length);
        i++
      ) {
        const price = Number(prices[i]);
        const date = String(data.labels[i]);

        if (
          Number.isFinite(price) &&
          price > 0 &&
          /^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
          if (!latest || date > latest.date) {
            latest = { date, price };
          }
        }
      }

      if (latest) {
        records.push({ ...country, ...latest });
      }
    }

    render();

  } catch (error) {
    if ($("status")) {
      $("status").textContent =
        "Ophalen mislukt: " +
        error.message +
        ". Controleer je internetverbinding en probeer opnieuw.";

      $("status").classList.add("error");
    }

    if ($("rows")) {
      $("rows").innerHTML =
        '<tr><td colspan="4">Gegevens konden niet worden opgehaald.</td></tr>';
    }

    if ($("count")) $("count").textContent = "0";
    if ($("best")) $("best").textContent = "—";

  } finally {
    if ($("refresh")) {
      $("refresh").disabled = false;
    }
  }
}

function calculate() {
  const litres = Number($("litres")?.value);
  const home = Number($("home")?.value);

  const list = records
    .filter((item) => Number.isFinite(item.price))
    .sort((a, b) => a.price - b.price);

  if ($("saving")) {
    if (
      list.length &&
      litres > 0 &&
      Number.isFinite(home) &&
      home > 0
    ) {
      const saving = (home - list[0].price) * litres;

      $("saving").textContent = saving > 0
        ? `Mogelijke besparing tegenover jouw prijs: ${euro(saving)}`
        : `Geen besparing tegenover jouw ingevoerde prijs (${euro(home)} per liter).`;

    } else {
      $("saving").textContent =
        "Vul je eigen literprijs en het aantal liters in om te vergelijken.";
    }
  }
}

$("fuel")?.addEventListener("change", load);
$("sort")?.addEventListener("change", render);
$("refresh")?.addEventListener("click", load);
$("litres")?.addEventListener("input", calculate);
$("home")?.addEventListener("input", calculate);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;

  if ($("install")) {
    $("install").hidden = false;
  }
});

$("install")?.addEventListener("click", async () => {
  if (!installPrompt) return;

  installPrompt.prompt();
  await installPrompt.userChoice;

  installPrompt = null;

  if ($("install")) {
    $("install").hidden = true;
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch(() => {});
  });
}

load();
