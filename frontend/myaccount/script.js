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
            const base64String = pfpSelect.value.trim();

            // Add the data prefix if it's missing
            if (base64String.startsWith('data:image')) {
                mainProfileImg.src = base64String;
            } else {
                // Assuming the API returns PNG. Use 'data:image/jpeg;base64,' if they are JPEGs.
                mainProfileImg.src = `data:image/png;base64,${base64String}`;
            }
        };
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

saveBtn.addEventListener("click", async () => {
    const selectedTitle = document.getElementById("edit-title").value;
    const selectedPFP = document.getElementById("edit-profile-pic").value;
    const userId = TOKEN.user_id;

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
            const titleData = await titleResp.json();
            if (!titleResp.ok) throw new Error(titleData.error || "Failed to update title.");
            document.querySelector(".usertitle").textContent = selectedTitle;
        }

        if (selectedPFP) {
            const pfpResp = await fetch(`https://spotting-api.onrender.com/users/pics/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${TOKEN.token}`
                },
                body: JSON.stringify({ current_pfp: selectedPFP })
            });
            const pfpData = await pfpResp.json();
            if (!pfpResp.ok) throw new Error(pfpData.error || "Failed to update profile pic.");
            const finalSrc = selectedPFP.startsWith('data:image')
                ? selectedPFP
                : `data:image/png;base64,${selectedPFP}`;
            document.querySelector(".profile-pic").src = finalSrc;
        }

        profileMessage.textContent = "Profile updated successfully!";
        profileMessage.style.color = "green";
        modal.style.display = "none";
    } catch (err) {
        profileMessage.textContent = err.message;
        profileMessage.style.color = "red";
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
document.addEventListener("DOMContentLoaded", loadMySpottings);