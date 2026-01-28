const TOKEN = {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id"),
    username: localStorage.getItem("username")
};

if (!TOKEN.token || !TOKEN.user_id) {
    console.error("User is not logged in!");
}
document.querySelector('#signout').addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id');
    window.location.href = ('./../loginpage/index.html')
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
    loadProfileOptions(TOKEN.user_id);
    console.log("Opening edit modal for user:", TOKEN.user_id);

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

        form.dataset.listenerAttached = "true";
    }
});
async function loadProfileOptions(userId) {
    const pfpSelect = document.getElementById("edit-profile-pic");
    const titleSelect = document.getElementById("edit-title")
    const modalContent = document.querySelector(".modal-content")
    console.log("pfpSelect:", pfpSelect);
    console.log("titleSelect:", titleSelect);
    
    modalContent.classList.add("loading")

    pfpSelect.innerHTML = ""
    titleSelect.innerHTML = ""
    
    
    
    try {

        const pfpResponse = await fetch(`https://spotting-api.onrender.com/users/pics/${userId}`, {
            headers: { "Authorization": `Bearer ${TOKEN.token}` }
        });

        if (!pfpResponse.ok) throw new Error("Failed to load profile pictures");

        const pfps = await pfpResponse.json();
        console.log("pfps:", pfps);


        pfpSelect.innerHTML = "";


        if (!pfps.length) {
            const option = document.createElement("option");
            option.textContent = "No profile pictures available";
            option.disabled = true;
            pfpSelect.appendChild(option);
        } else {
            pfps.forEach((pfp, index) => {
                if (!pfp?.profile_picture) return;

                const option = document.createElement("option");


                const imgValue = pfp.profile_picture.trim();

                option.value = imgValue;
                option.textContent = pfp.common_name || `Custom Image ${index + 1}`;
                pfpSelect.appendChild(option);
            });
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
    } finally {
        modalContent.classList.remove("loading")
    }
}
const saveBtn = document.getElementById("save-profile");
const profileMessage = document.getElementById("profile-message");

saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    modal.style.display = "none"

    const accInfo = document.querySelector(".accinfo");
    accInfo.classList.add("loading");

    const selectedTitle = document.getElementById("edit-title").value;
    const selectedPFP = document.getElementById("edit-profile-pic").value;
    const userId = TOKEN.user_id;
    console.log(selectedPFP);
    try {

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


        if (selectedPFP) {
            const pfpResp = await fetch(
                `https://spotting-api.onrender.com/users/pics/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${TOKEN.token}`
                    },
                    body: JSON.stringify({ current_pfp: selectedPFP })
                }
            );

            if (!pfpResp.ok) {
                const err = await pfpResp.json();
                throw new Error(err.error || "Failed to update profile picture.");
            }
        }


        await loadAccountInfo();

        modal.style.display = "none"
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

        if (!res.ok) throw new Error("No Spottings Yet!");

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
        list.innerHTML = `<div class="no-sightings">
            <p>No Spottings Yet!</p>
            <img src="../assets/sadowl.jpeg" alt="No sightings" />
        </div>`
    ;
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
   
    
    const accInfo = document.querySelector(".accinfo");
    accInfo.classList.add("loading");

    try {
        const userId = TOKEN.user_id;
        const username = TOKEN.username;

        const userRes = await fetch(
            `https://spotting-api.onrender.com/users/id/${userId}`,
            { headers: { Authorization: `Bearer ${TOKEN.token}` } }
        );
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        const user = await userRes.json();
 
        const spottingsRes = await fetch(
            `https://spotting-api.onrender.com/spottings/filter/user/${username}`,
            { headers: { Authorization: `Bearer ${TOKEN.token}` } }
        );
        const spottings = spottingsRes.ok ? await spottingsRes.json() : [];

        const zooRes = await fetch(
            `https://spotting-api.onrender.com/users/zoo/${userId}`,
            { headers: { Authorization: `Bearer ${TOKEN.token}` } }
        );
        const zoo = zooRes.ok ? await zooRes.json() : [];

        /* === Update DOM AFTER all data is ready === */

        const profilePic = document.querySelector(".profile-pic");
        if (user.current_pfp) profilePic.src = user.current_pfp;

        document.querySelector(".username").textContent = user.username;
        document.querySelector(".usertitle").textContent =
            user.current_title || "Wildlife Spotter";

        document.getElementById("total-xp").textContent =
            user.total_points ?? 0;

        const stats = document.querySelectorAll(".stat-row strong");
        stats[0].textContent = zoo.length;
        stats[1].textContent = spottings.length;

    } catch (err) {
        console.error("Error loading account info:", err);
    } finally {
        accInfo.classList.remove("loading");
    }
}
async function loadAchievements() {
    const achList = document.querySelector(".achlist");
    if (!achList) return;

    try {

        const [resAll, resUser] = await Promise.all([
            fetch(`https://spotting-api.onrender.com/achievements`, {
            headers: {
                Authorization: `Bearer ${TOKEN.token}`
            }
        }),
        fetch(`https://spotting-api.onrender.com/users/achievements/${TOKEN.user_id}`,{
            headers: { Authorization: `Bearer ${TOKEN.token}`}
        })

        ])
         

        if (!resAll.ok) throw new Error("Failed to fetch achievements");
        if (!resUser.ok) throw new Error("Failed to fetch user achievements")

        const achievements = await resAll.json();
        const userAchievements = await resUser.json();

        const completedSet = new Set(userAchievements.map(a => a.achievement_id))


        achList.innerHTML = "";


        achievements.forEach(ach => {
            const item = document.createElement("div");
            item.className = "achievement-item";

            const info = document.createElement("div");
            info.className = "achievement-info";


            const title = document.createElement("div");
            title.className = "achievement-title";
            title.textContent = ach.title || "Untitled";


            const desc = document.createElement("div");
            desc.className = "achievement-desc";
            desc.textContent = ach.achievement_description || "";


            const reward = document.createElement("div");
            reward.className = "achievement-reward";
            reward.textContent = `Reward: ${ach.value || 0} XP`;

            info.append(title, desc, reward);


            const tick = document.createElement("div");
            if (completedSet.has(ach.achievement_id)) {
                tick.className = "achievement-tick achieved";
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