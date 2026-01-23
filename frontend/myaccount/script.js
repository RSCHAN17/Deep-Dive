const TOKEN = {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id"),
    username: localStorage.getItem("username")
};

if (!TOKEN.token || !TOKEN.user_id) {
    console.error("User is not logged in!");
    // optionally redirect to login page
}
document.querySelector('#signout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.assign('./../loginpage/index.html')
})
function getUsernameFromToken(token) {
    try {
        const payloadBase64 = token.split(".")[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        return payload.username;
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
}

const usernameEl = document.querySelector(".username");

const usernameFromToken = getUsernameFromToken(TOKEN.token);
if (usernameFromToken && usernameEl) {
    usernameEl.textContent = usernameFromToken;
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
    window.location.href = "../submitspot/index.html"
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

const editBtn = document.querySelector(".edit-profile");
const modal = document.getElementById("edit-modal");
const closeBtn = modal.querySelector(".close-btn");



closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});


window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

console.log("TOKEN on profile page:", TOKEN)
editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    loadProfileOptions(TOKEN.user_id); // dynamically populate dropdowns
console.log("Opening edit modal for user:", TOKEN.user_id);
    // Only attach listener once
    const form = document.querySelector("#changepassword");
    const message = document.querySelector("#password-message");
    if (form && !form.dataset.listenerAttached) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const currentInput = document.getElementById('current-password');
            const newInput = document.getElementById('new-password');
            const confirmInput = document.getElementById('confirm-password');

            if (!currentInput || !newInput || !confirmInput) {
                console.error("Password inputs not found");
                return;
            }

            const currentPassword = currentInput.value;
            const newPassword = newInput.value;
            const confirmPassword = confirmInput.value;

            console.log("inputs:", { currentPassword, newPassword, confirmPassword });

            if (newPassword !== confirmPassword) {
                message.textContent = "New passwords don't match";
                message.style.color = "red";
                return;
            }

            try {
                const response = await fetch(`https://spotting-api.onrender.com/users/update/${TOKEN.user_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${TOKEN.token}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                });

                let data = {};
                if (response.headers.get("content-type")?.includes("application/json")) {
                    data = await response.json();
                }

                if (!response.ok) throw new Error(data.error || "Password update failed.");

                message.textContent = "Password updated successfully.";
                message.style.color = "green";
                form.reset();
                modal.style.display = "none";
            } catch (err) {
                message.textContent = err.message;
                message.style.color = "red";
            }
        });

        form.dataset.listenerAttached = "true"; // prevent double listener
    }
});
async function loadProfileOptions(userId) {
    const pfpSelect = document.getElementById("edit-profile-pic");
    const titleSelect = document.getElementById("edit-title")
    console.log("pfpSelect:", pfpSelect);
console.log("titleSelect:", titleSelect);
    try {
        // Fetch profile pictures from API
        const pfpResponse = await fetch(`https://spotting-api.onrender.com/users/pics/${userId}`, {
            headers: { "Authorization": `Bearer ${TOKEN.token}` }
        });

        if (!pfpResponse.ok) throw new Error("Failed to load profile pictures");

        const pfps = await pfpResponse.json();
        console.log("pfps:", pfps); // Debug log to check API response

        // Ensure we have an array
        // Clear existing options first
        pfpSelect.innerHTML = "";

        // Handle empty array
        if (!pfps.length) {
            const option = document.createElement("option");
            option.textContent = "No profile pictures available";
            option.disabled = true;
            pfpSelect.appendChild(option);
        } else {
            pfps.forEach((pfp, index) => {
                if (!pfp?.profile_picture) return;

                const option = document.createElement("option");

                // trim to remove spaces/newlines
                const imgValue = pfp.profile_picture.trim();

                option.value = imgValue;
                option.textContent = pfp.common_name || `Custom Image ${index + 1}`;
                pfpSelect.appendChild(option);
            });
        }
        pfpSelect.onchange = () => {
    const mainProfileImg = document.querySelector(".accinfo .profile-pic");
    if (!mainProfileImg) return;

    let base64String = pfpSelect.value.trim();
    console.log("Selected PFP value:", base64String);
console.log("mainProfileImg found?", mainProfileImg);
    // If it already starts with data:image, use it directly
    if (base64String.startsWith("data:image")) {
        mainProfileImg.src = base64String;
       
mainProfileImg.onload = () => console.log("Profile pic updated!");
    } else if (base64String.length > 0) {
        mainProfileImg.src = `data:image/png;base64,${base64String}`;
    } else {
        console.warn("Profile picture value is empty");
    }
};
if (pfpSelect.options.length > 0) {
    pfpSelect.selectedIndex = 0;
    pfpSelect.onchange();
}

        const titleResponse = await fetch(`https://spotting-api.onrender.com/users/title/${userId}`, {
            headers: { "Authorization": `Bearer ${TOKEN.token}` }
        });
        if (!titleResponse.ok) throw new Error("Failed to load titles");
        const titles = await titleResponse.json();


        titleSelect.innerHTML = "";


        titles.forEach(title => {
            const option = document.createElement("option");
            option.value = title;
            option.textContent = title;
            titleSelect.appendChild(option);
        });

    } catch (err) {
        console.error("Error loading profile options:", err);
    }
}
const saveBtn = document.getElementById("save-profile");
const profileMessage = document.getElementById("profile-message");

saveBtn.addEventListener("click", async (e) => {
   e.preventDefault();
    
    const selectedTitle = document.getElementById("edit-title").value;
    const selectedPFP = document.getElementById("edit-profile-pic").value;
    const userId = TOKEN.user_id;

    try {
        // Update title
        if (selectedTitle) {
            const titleResp = await fetch(`https://spotting-api.onrender.com/users/title/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TOKEN.token}`
                },
                body: JSON.stringify({ current_title: selectedTitle })
            });
            if (!titleResp.ok) {
                const errorData = await titleResp.json();
                throw new Error(errorData.error || "Failed to update title.");
            }
            document.querySelector(".usertitle").textContent = selectedTitle;
        }

        // Update profile picture
        if (selectedPFP) {
            const pfpResp = await fetch(`https://spotting-api.onrender.com/users/pics/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TOKEN.token}`
                },
                body: JSON.stringify({ current_pfp: selectedPFP })
            });
            if (!pfpResp.ok) {
                const errorData = await pfpResp.json();
                throw new Error(errorData.error || "Failed to update profile pic.");
            }

            // Directly use selectedPFP; it already includes data:image prefix
            const profileImgEl = document.querySelector(".profile-pic");
            profileImgEl.src = selectedPFP;

            console.log("Profile pic updated:", profileImgEl.src);
        }

        profileMessage.textContent = "Profile updated successfully!";
        profileMessage.style.color = "green";
        modal.style.display = "none";
    } catch (err) {
        profileMessage.textContent = err.message;
        profileMessage.style.color = "red";
        console.error("Error saving profile:", err);
    }
});


async function loadMySpottings() {
    const list = document.getElementById("sighting-list");
    list.innerHTML = "";

    try {
        const res = await fetch(
            `https://spotting-api.onrender.com/spottings/filter/user/${TOKEN.username}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN.token}`
                }
            }
        );

        if (!res.ok) throw new Error("Failed to load spottings");

        const spottings = await res.json();

        if (!spottings.length) {
            list.innerHTML = "<p>No sightings yet.</p>";
            return;
        }

        spottings.forEach(s => {
            const item = document.createElement("div");
            item.className = "sighting-item";

            const img = document.createElement("img");
            img.className = "sighting-img";
            img.src = s.image_url || "../assets/fox.jpg";
            img.alt = s.animal_name;

            const info = document.createElement("div");
            info.className = "sighting-info";

            info.innerHTML = `
                <div class="sighting-species">${capitalize(s.animal_name)}</div>
                <div class="sighting-location">${s.location}</div>
                <div class="sighting-date">${formatDate(s.date_time)}</div>
            `;

            item.append(img, info);
            list.appendChild(item);
        });

    } catch (err) {
        console.error("Error loading spottings:", err);
        list.innerHTML = "<p>Error loading sightings.</p>";
    }
}
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function capitalize(str) {
    if (!str) return "";
    return str
        .split(" ")
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(" ");
}


async function loadMyZoo() {
    const zooList = document.querySelector(".zoo-list");
    zooList.innerHTML = "";

    try {
        const [allAnimalsRes, userZooRes] = await Promise.all([
            fetch("https://spotting-api.onrender.com/animals"),
            fetch(`https://spotting-api.onrender.com/users/zoo/${TOKEN.user_id}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN.token}`
                }
            })
        ]);

        if (!allAnimalsRes.ok || !userZooRes.ok) {
            throw new Error("Failed to load zoo data");
        }

        const allAnimals = await allAnimalsRes.json();
        const userZoo = await userZooRes.json();

        // Create a lookup set of spotted animals
        const spottedSet = new Set(
            userZoo.map(a => a.name.toLowerCase())
        );

        allAnimals.forEach(animal => {
            const spotted = spottedSet.has(animal.name.toLowerCase());

            const item = document.createElement("div");
            item.className = "zoo-item";

            item.innerHTML = `
                <img src="${animal.image_url || '../assets/fox.jpg'}"
                     alt="${animal.name}"
                     class="zoo-img">

                <div class="zoo-info">
                    <div class="zoo-species">${capitalize(animal.name)}</div>
                    <div class="zoo-latin">${animal.species || ''}</div>
                    <div class="zoo-group">${animal.type || ''}</div>
                </div>

                <div class="zoo-reward">
                    ${spotted ? '' : ''}
                    <div class="achievement-tick ${spotted ? 'achieved' : ''}"></div>
                </div>
            `;

            zooList.appendChild(item);
        });

    } catch (err) {
        console.error("Error loading MyZoo:", err);
        zooList.innerHTML = "<p>Failed to load zoo.</p>";
    }
}
const zooSearchInput = document.getElementById("zoo-search");

zooSearchInput.addEventListener("input", () => {
    const query = zooSearchInput.value.toLowerCase().trim();
    const zooItems = document.querySelectorAll(".zoo-item");

    zooItems.forEach(item => {
        const species = item.querySelector(".zoo-species")?.textContent.toLowerCase() || "";
        const latin = item.querySelector(".zoo-latin")?.textContent.toLowerCase() || "";
        const group = item.querySelector(".zoo-group")?.textContent.toLowerCase() || "";

        const matches =
            species.includes(query) ||
            latin.includes(query) ||
            group.includes(query);

        item.style.display = matches ? "flex" : "none";
    });
});
async function loadAccountInfo() {
    try {
        const userId = TOKEN.user_id;
        const username = TOKEN.username;

        // 1️⃣ Fetch basic user info
        const userRes = await fetch(`https://spotting-api.onrender.com/users/id/${userId}`, {
            headers: { Authorization: `Bearer ${TOKEN.token}` }
        });

        if (!userRes.ok) throw new Error("Failed to fetch user info");
        const user = await userRes.json();

        console.log("User info:", user);

        // Profile pic
        const profilePic = document.querySelector(".accinfo .profile-pic");
        if (user.current_pfp) profilePic.src = user.current_pfp;

        // Username & title
        const usernameEl = document.querySelector(".accinfo .username");
        const usertitleEl = document.querySelector(".accinfo .usertitle");
        if (usernameEl) usernameEl.textContent = user.username || "Username";
        if (usertitleEl) usertitleEl.textContent = user.current_title || "Wildlife Spotter";

        // Level, XP, progress
        const levelStrong = document.querySelector(".accinfo .level-row strong");
        const progressFill = document.querySelector(".accinfo .progress-fill");
        const xpText = document.querySelector(".accinfo .xp-text");
        if (levelStrong) levelStrong.textContent = user.level || 1;
        if (progressFill && user.xp != null && user.next_level_xp != null) {
            const percent = Math.min((user.xp / user.next_level_xp) * 100, 100);
            progressFill.style.width = percent + "%";
        }
        if (xpText && user.xp != null && user.next_level_xp != null) {
            xpText.textContent = `${user.xp} / ${user.next_level_xp}XP`;
        }

        // 2️⃣ Fetch total spottings
        const spottingsRes = await fetch(`https://spotting-api.onrender.com/spottings/filter/user/${username}`, {
            headers: { Authorization: `Bearer ${TOKEN.token}` }
        });
        let spottings = [];
        if (spottingsRes.ok) {
            spottings = await spottingsRes.json();
        } else {
            console.warn("Failed to fetch spottings");
        }

        // 3️⃣ Fetch distinct species for zoo
        const zooRes = await fetch(`https://spotting-api.onrender.com/users/zoo/${userId}`, {
            headers: { Authorization: `Bearer ${TOKEN.token}` }
        });
        let zoo = [];
        if (zooRes.ok) {
            zoo = await zooRes.json();
        } else {
            console.warn("Failed to fetch zoo");
        }

        // Update stats in DOM
        const statRows = document.querySelectorAll(".accinfo .user-stats .stat-row strong");
        if (statRows.length >= 2) {
            statRows[0].textContent = zoo.length;       // distinct species
            statRows[1].textContent = spottings.length; // total spottings
        }

    } catch (err) {
        console.error("Error loading account info:", err);
    }
}

async function loadAchievements() {
    const achList = document.querySelector(".achlist");
    if (!achList) return;

    try {
        // Fetch all achievements
        const res = await fetch(`https://spotting-api.onrender.com/achievements`, {
            headers: {
                Authorization: `Bearer ${TOKEN.token}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch achievements");

        const achievements = await res.json();
        console.log("Achievements:", achievements);

        // Clear existing list
        achList.innerHTML = "";

        // Loop through achievements and create DOM elements
        achievements.forEach(ach => {
            const item = document.createElement("div");
            item.className = "achievement-item";

            const info = document.createElement("div");
            info.className = "achievement-info";

            // Title
            const title = document.createElement("div");
            title.className = "achievement-title";
            title.textContent = ach.title || "Untitled";

            // Description
            const desc = document.createElement("div");
            desc.className = "achievement-desc";
            desc.textContent = ach.achievement_description || "";

            // Reward
            const reward = document.createElement("div");
            reward.className = "achievement-reward";
            reward.textContent = `Reward: ${ach.value || 0} XP`;

            info.append(title, desc, reward);

            // Tick (achieved or not)
            const tick = document.createElement("div");
            if (ach.achieved) {
                tick.className = "achievement-tick achieved"; // green tick
            }

            item.append(info, tick);
            achList.appendChild(item);
        });

    } catch (err) {
        console.error("Error loading achievements:", err);
        achList.innerHTML = "<p>Failed to load achievements.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadMySpottings();
    loadMyZoo();
    loadAccountInfo();
    loadAchievements();

} 
    );