const homeBtn = document.querySelector("#logo")
const homeBtn2 = document.querySelector("#title")

homeBtn.addEventListener("click", () => {
    window.location.href = "../landingpage/index.html"
})
homeBtn2.addEventListener("click", () => {
    window.location.href = "../landingpage/index.html"
})

const dropDown1 = document.querySelector("#dd1")
const dropDown2 = document.querySelector("#dd2")
const dropDown3 = document.querySelector("#dd3")
const dropDown4 = document.querySelector("#dd4")

dropDown4.addEventListener("click", () => {
    window.location.href = "../submitspot/index.html"
})
dropDown2.addEventListener("click", () => {
    window.location.href = "../aboutus/index.html"
})
dropDown3.addEventListener("click", () => {
    window.location.href = "../spottedmap/index.html"
})
dropDown1.addEventListener("click", () => {
    window.location.href = "../myaccount/index.html"
})

const leaderboardList = document.querySelector("#leaderboardList")

function getItemClass(rank) {
    if (rank === 1) return "leaderboard-item gold"
    if (rank === 2) return "leaderboard-item silver"
    if (rank === 3) return "leaderboard-item bronze"
    return "leaderboard-item"
}

function getTitle(user) {
    try {
        return user.current_title ? JSON.parse(user.current_title).current_title : ""
    } catch (e) {
        return ""
    }
}

fetch("https://spotting-api.onrender.com/users/")
    .then(res => res.json())
    .then(users => {
        users.sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
        users = users.slice(0, 10)

        leaderboardList.innerHTML = users.map((user, index) => `
            <div class="${getItemClass(index + 1)}">
                <span class="rank">${index + 1}</span>
                <div class="user-info">
                    <span class="username">${user.username}</span>
                    <span class="user-title">${getTitle(user)}</span>
                </div>
                <span class="score">${Math.floor(user.total_points || 0)} XP</span>
            </div>
        `).join("")
    })
