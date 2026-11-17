// Datos ficticios para demostración académica.
const dailyData = [
  { date: "2026-10-11", reach: 5200, likes: 410, comments: 72, shares: 58, newFollowers: 28, unfollows: 5, posts: 1 },
  { date: "2026-10-12", reach: 6800, likes: 560, comments: 95, shares: 74, newFollowers: 34, unfollows: 6, posts: 2 },
  { date: "2026-10-13", reach: 6100, likes: 485, comments: 81, shares: 63, newFollowers: 31, unfollows: 4, posts: 1 },
  { date: "2026-10-14", reach: 7900, likes: 640, comments: 108, shares: 88, newFollowers: 39, unfollows: 7, posts: 2 },
  { date: "2026-10-15", reach: 7200, likes: 590, comments: 96, shares: 77, newFollowers: 36, unfollows: 5, posts: 1 },
  { date: "2026-10-16", reach: 9100, likes: 760, comments: 132, shares: 105, newFollowers: 45, unfollows: 8, posts: 2 },
  { date: "2026-10-17", reach: 8400, likes: 690, comments: 118, shares: 92, newFollowers: 41, unfollows: 6, posts: 1 },
  { date: "2026-10-18", reach: 7600, likes: 620, comments: 101, shares: 82, newFollowers: 37, unfollows: 5, posts: 1 },
  { date: "2026-10-19", reach: 8800, likes: 735, comments: 126, shares: 99, newFollowers: 43, unfollows: 7, posts: 2 },
  { date: "2026-10-20", reach: 6900, likes: 550, comments: 90, shares: 70, newFollowers: 33, unfollows: 4, posts: 1 },
  { date: "2026-10-21", reach: 9500, likes: 805, comments: 140, shares: 116, newFollowers: 48, unfollows: 9, posts: 2 },
  { date: "2026-10-22", reach: 8100, likes: 670, comments: 113, shares: 89, newFollowers: 40, unfollows: 6, posts: 1 },
  { date: "2026-10-23", reach: 7300, likes: 585, comments: 97, shares: 76, newFollowers: 35, unfollows: 5, posts: 1 },
  { date: "2026-10-24", reach: 9200, likes: 780, comments: 135, shares: 108, newFollowers: 46, unfollows: 8, posts: 2 },
  { date: "2026-10-25", reach: 8600, likes: 710, comments: 121, shares: 95, newFollowers: 42, unfollows: 6, posts: 1 },
  { date: "2026-10-26", reach: 7800, likes: 635, comments: 105, shares: 84, newFollowers: 38, unfollows: 5, posts: 1 },
  { date: "2026-10-27", reach: 9700, likes: 830, comments: 146, shares: 120, newFollowers: 50, unfollows: 9, posts: 2 },
  { date: "2026-10-28", reach: 8900, likes: 745, comments: 128, shares: 101, newFollowers: 44, unfollows: 7, posts: 1 },
  { date: "2026-10-29", reach: 8300, likes: 680, comments: 116, shares: 91, newFollowers: 40, unfollows: 6, posts: 1 },
  { date: "2026-10-30", reach: 9400, likes: 795, comments: 138, shares: 112, newFollowers: 47, unfollows: 8, posts: 2 }
];

const numberFormat = new Intl.NumberFormat("es-ES");
const compactFormat = new Intl.NumberFormat("es-ES", {
  notation: "compact",
  maximumFractionDigits: 1
});
const dateFormat = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

function formatDate(value) {
  return dateFormat.format(new Date(`${value}T12:00:00`));
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + row[key], 0);
}

function renderDailyTable(rows) {
  document.getElementById("dailyDataRows").innerHTML = rows.map(row => {
    const interactions = row.likes + row.comments + row.shares;
    return `<tr>
      <td>${formatDate(row.date)}</td>
      <td>${numberFormat.format(row.reach)}</td>
      <td>${numberFormat.format(interactions)}</td>
      <td>${numberFormat.format(row.newFollowers)}</td>
      <td>${numberFormat.format(row.posts)}</td>
    </tr>`;
  }).join("");
  document.getElementById("dailyDataSummary").textContent =
    `${rows.length} ${rows.length === 1 ? "día" : "días"} en el periodo seleccionado`;
}

function drawChart(rows) {
  const canvas = document.getElementById("trendChart");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  const w = rect.width, h = rect.height;
  const pad = { top: 15, right: 12, bottom: 30, left: 38 };
  const plotW = w - pad.left - pad.right, plotH = h - pad.top - pad.bottom;
  const max = 10000;
  ctx.clearRect(0, 0, w, h);
  ctx.font = "10px DM Sans, sans-serif";
  ctx.fillStyle = "#9a9daf";
  ctx.textAlign = "right";
  [0, 2500, 5000, 7500, 10000].forEach(value => {
    const y = pad.top + plotH - (value / max) * plotH;
    ctx.strokeStyle = "#eef0f5"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
    ctx.fillText(value === 0 ? "0" : (value / 1000) + "k", pad.left - 8, y + 3);
  });

  if (!rows.length) {
    ctx.textAlign = "center";
    ctx.fillText("Sin datos para este periodo", w / 2, h / 2);
    return;
  }

  const x = index => rows.length === 1
    ? pad.left + plotW / 2
    : pad.left + (index / (rows.length - 1)) * plotW;
  const y = value => pad.top + plotH - (value / max) * plotH;
  function line(values, color, width) {
    ctx.beginPath();
    values.forEach((value, index) => index
      ? ctx.lineTo(x(index), y(value))
      : ctx.moveTo(x(index), y(value)));
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
    values.forEach((value, index) => {
      ctx.beginPath(); ctx.arc(x(index), y(value), 3, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    });
  }
  line(rows.map(row => row.reach), "#7557e8", 2.8);
  line(rows.map(row => row.likes + row.comments + row.shares), "#42a5f5", 2.5);

  const labelStep = Math.max(1, Math.ceil(rows.length / 7));
  ctx.textAlign = "center"; ctx.fillStyle = "#9a9daf";
  rows.forEach((row, index) => {
    if (index % labelStep === 0 || index === rows.length - 1) {
      ctx.fillText(formatDate(row.date).replace(" de 2026", "").replace(" 2026", ""), x(index), h - 8);
    }
  });
}

function renderDashboard(startDate, endDate) {
  const rows = dailyData.filter(row => row.date >= startDate && row.date <= endDate);
  const totalReach = sum(rows, "reach");
  const likes = sum(rows, "likes");
  const comments = sum(rows, "comments");
  const shares = sum(rows, "shares");
  const interactions = likes + comments + shares;
  const newFollowers = sum(rows, "newFollowers");
  const unfollows = sum(rows, "unfollows");
  const netGrowth = newFollowers - unfollows;
  const posts = sum(rows, "posts");

  document.getElementById("reachValue").textContent = compactFormat.format(totalReach);
  document.getElementById("interactionsValue").textContent = numberFormat.format(interactions);
  document.getElementById("followersValue").textContent = `${netGrowth >= 0 ? "+" : ""}${numberFormat.format(netGrowth)}`;
  document.getElementById("postsValue").textContent = numberFormat.format(posts);
  document.getElementById("selectedPeriod").innerHTML =
    `<span>${formatDate(startDate)} <span aria-hidden="true">→</span> ${formatDate(endDate)}</span>`;
  document.getElementById("donutTotal").textContent = numberFormat.format(interactions);
  document.getElementById("likesValue").innerHTML =
    `${numberFormat.format(likes)} <small>${interactions ? ((likes / interactions) * 100).toFixed(1).replace(".", ",") : "0"}%</small>`;
  document.getElementById("commentsValue").innerHTML =
    `${numberFormat.format(comments)} <small>${interactions ? ((comments / interactions) * 100).toFixed(1).replace(".", ",") : "0"}%</small>`;
  document.getElementById("sharesValue").innerHTML =
    `${numberFormat.format(shares)} <small>${interactions ? ((shares / interactions) * 100).toFixed(1).replace(".", ",") : "0"}%</small>`;
  document.querySelector(".donut").style.background = interactions
    ? `conic-gradient(#7557e8 0 ${(likes / interactions) * 100}%, #42a5f5 ${(likes / interactions) * 100}% ${((likes + comments) / interactions) * 100}%, #f5a45d ${((likes + comments) / interactions) * 100}% 100%)`
    : "#edf0f5";
  document.getElementById("newFollowersValue").textContent = numberFormat.format(newFollowers);
  document.getElementById("unfollowsValue").textContent = numberFormat.format(unfollows);
  document.getElementById("growthTag").textContent = `${netGrowth >= 0 ? "+" : ""}${numberFormat.format(netGrowth)} en el periodo`;
  const progress = Math.min(100, Math.max(0, (netGrowth / 800) * 100));
  document.getElementById("growthProgressValue").textContent = `${Math.round(progress)}%`;
  document.getElementById("growthProgress").style.width = `${progress}%`;
  document.getElementById("chartPeriod").textContent =
    `Evolución diaria · ${rows.length} ${rows.length === 1 ? "día" : "días"}`;

  renderDailyTable(rows);
  drawChart(rows);
}

const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const filterMessage = document.getElementById("filterMessage");

document.getElementById("applyDateFilter").addEventListener("click", () => {
  if (!startDateInput.value || !endDateInput.value || startDateInput.value > endDateInput.value) {
    filterMessage.textContent = "Selecciona un rango válido: la fecha inicial debe ser anterior o igual a la fecha final.";
    filterMessage.hidden = false;
    return;
  }
  filterMessage.hidden = true;
  renderDashboard(startDateInput.value, endDateInput.value);
});

document.getElementById("refreshBtn").addEventListener("click", () => {
  renderDashboard(startDateInput.value, endDateInput.value);
  const btn = document.getElementById("refreshBtn");
  btn.textContent = "✓ Actualizado";
  setTimeout(() => btn.textContent = "↻ Actualizar", 1200);
});

window.addEventListener("resize", () => renderDashboard(startDateInput.value, endDateInput.value));
renderDashboard(startDateInput.value, endDateInput.value);
