const TOKEN = {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id")
};

if (!TOKEN.token || !TOKEN.user_id) {
    console.error("User is not logged in!");
    // optionally redirect to login page
}
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

dropDown1.addEventListener("click", () => {
    window.location.href = "../myaccount/index.html"
})
dropDown2.addEventListener("click", () => {
    window.location.href = "../aboutus/index.html"
})
dropDown3.addEventListener("click", () => {
    window.location.href = "../spottedmap/index.html"
})
dropDown4.addEventListener("click", () => {
    window.location.href = "../leaderboards/index.html"
})

const signInBtn = document.querySelector("#signInBtn")
const mapBtn = document.querySelector("#mapBtn")
const submitBtn = document.querySelector("#submitBtn")

signInBtn.addEventListener("click", () => {
    window.location.href = "../loginpage/index.html"
})
mapBtn.addEventListener("click", () => {
    window.location.href = "../spottedmap/index.html"
})
submitBtn.addEventListener("click", () => {
    window.location.href = "../submitspot/index.html"
})
console.log("TOKEN on profile page:", TOKEN)

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const signInBtn = document.getElementById("signInBtn");

    if (token && signInBtn) {
        
        signInBtn.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const challengeList = document.querySelector(".challenge-list");
    const switchInput = document.querySelector(".switch input[type='checkbox']");

    let allChallenges = []; 
    const WEEKLY_THRESHOLD = 100; 
    const MAX_DISPLAY = 2; 

    // Function to fetch all challenges
    async function fetchChallenges() {
        try {
            // Replace with your real API endpoint
            const res = await fetch("https://spotting-api.onrender.com/challenges");
            if (!res.ok) throw new Error("Failed to fetch challenges");
            const challenges = await res.json();
            allChallenges = challenges;
            return challenges;
        } catch (err) {
            console.error(err);
            allChallenges = [];
            return [];
        }
    }

    // Function to filter challenges based on daily/weekly
    function getFilteredChallenges(isWeekly) {
        let filtered;
        if (isWeekly) {
            filtered = allChallenges.filter(ch => ch.points > WEEKLY_THRESHOLD);
        } else {
            filtered = allChallenges.filter(ch => ch.points <= WEEKLY_THRESHOLD);
        }
        return filtered.slice(0, MAX_DISPLAY); // only show first 2
    }

    // Function to render challenges
    function renderChallenges(challenges) {
        challengeList.innerHTML = ""; // clear current
        challenges.forEach(ch => {
            const item = document.createElement("div");
            item.className = "challenge-item";

            item.innerHTML = `
                <input type="checkbox" class="challenge-check">
                <span class="challenge-desc">${ch.challenge_description}</span>
                <span class="challenge-reward">+${ch.points} XP</span>
            `;
            challengeList.appendChild(item);
        });
    }

    // Initial load (daily challenges by default)
    async function loadInitialChallenges() {
        await fetchChallenges();
        const dailyChallenges = getFilteredChallenges(false);
        renderChallenges(dailyChallenges);
    }

    loadInitialChallenges();

    // Switch toggle event
    switchInput.addEventListener("change", () => {
        const isWeekly = switchInput.checked;
        const filteredChallenges = getFilteredChallenges(isWeekly);
        renderChallenges(filteredChallenges);
    });
});