const homeBtn = document.querySelector("#logo");
const homeBtn2 = document.querySelector("#title");

homeBtn.addEventListener("click", () => {
  window.location.href = "../landingpage/index.html";
});

homeBtn2.addEventListener("click", () => {
  window.location.href = "../landingpage/index.html";
});


const dropDown1 = document.querySelector("#dd1");
const dropDown2 = document.querySelector("#dd2");
const dropDown3 = document.querySelector("#dd3");
const dropDown4 = document.querySelector("#dd4");

dropDown1.addEventListener("click", () => {
  window.location.href = "../myaccount/index.html";
});

dropDown2.addEventListener("click", () => {
  window.location.href = "../aboutus/index.html";
});

dropDown3.addEventListener("click", () => {
  window.location.href = "../spottedmap/index.html";
});

dropDown4.addEventListener("click", () => {
  window.location.href = "../submitspot/index.html";
});


const leaderboardList = document.querySelector("#leaderboardList");
const leaderboardToggle = document.querySelector("#leaderboardToggle");

function getItemClass(rank) {
  if (rank === 1) return "leaderboard-item gold";
  if (rank === 2) return "leaderboard-item silver";
  if (rank === 3) return "leaderboard-item bronze";
  return "leaderboard-item";
}

function getTitle(user) {
  try {
    return user.current_title
      ? JSON.parse(user.current_title).current_title
      : "";
  } catch {
    return "";
  }
}

function renderMessage(text) {
  leaderboardList.innerHTML = `
    <div class="leaderboard-item">
      <span>${text}</span>
    </div>
  `;
}

function render(rows, suffix) {
  leaderboardList.innerHTML = rows
    .map(
      (row, index) => `
      <div class="${getItemClass(index + 1)}">
        <span class="rank">${index + 1}</span>

        <div class="user-info">
          <span class="username">${row.username}</span>
          <span class="user-title">${row.title || ""}</span>
        </div>

        <span class="score">
          ${Math.floor(row.score || 0)} ${suffix}
        </span>
      </div>
    `
    )
    .join("");
}


function getThisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { start, end };
}

async function loadAllTime() {
  renderMessage("Loading…");

  const res = await fetch("https://spotting-api.onrender.com/users/");
  const users = await res.json();

  users.sort(
    (a, b) => (b.total_points || 0) - (a.total_points || 0)
  );

  render(
    users.slice(0, 10).map((u) => ({
      username: u.username,
      title: getTitle(u),
      score: u.total_points || 0,
    })),
    "XP"
  );
}

async function loadMonthlyThisMonth() {
  renderMessage("Loading Leaderboard…");

  const [usersRes, spotsRes] = await Promise.all([
    fetch("https://spotting-api.onrender.com/users/"),
    fetch("https://spotting-api.onrender.com/spottings/"),
  ]);

  const users = await usersRes.json();
  const spots = await spotsRes.json();

  const { start, end } = getThisMonthRange();
  const totals = new Map();
  const userMap = new Map(users.map((u) => [u.username, u]));

  for (const s of spots) {
    if (!s.username || !s.date_time) continue;

    const dt = new Date(s.date_time);
    if (isNaN(dt.getTime())) continue;
    if (dt < start || dt >= end) continue;

    const pts = Number(s.spot_points) || 0;
    totals.set(s.username, (totals.get(s.username) || 0) + pts);
  }

  if (totals.size === 0) {
    renderMessage(
      "No spottings yet this month... be the first!"
    );
    return;
  }

  const rows = Array.from(totals.entries())
    .map(([username, score]) => {
      const u = userMap.get(username);
      return {
        username,
        title: u ? getTitle(u) : "",
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  render(rows, "XP");
}

async function loadLeaderboard() {
  try {
    if (leaderboardToggle.checked) {
      await loadAllTime();
    } else {
      await loadMonthlyThisMonth();
    }
  } catch (e) {
    console.error(e);
    renderMessage("Failed to load leaderboard.");
  }
}

leaderboardToggle.addEventListener("change", loadLeaderboard);
loadLeaderboard();
