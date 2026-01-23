const TOKEN = {
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id")
};

if (!TOKEN.token || !TOKEN.user_id) {
    console.error("User is not logged in!");
    // optionally redirect to login page
}

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
});



const form = document.querySelector("#changepassword")
const message = document.querySelector("#password-message")

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if(newPassword !== confirmPassword) {
    message.textContent = "New passwords don't match"
    message.style.color = "red"
    return
  }

  try {
  

    const response = await fetch(`https://spotting-api.onrender.com/users/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN.token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPass
      })
    });
    const data = await response.json()
    if(!response.ok) {
      throw new Error(data.error || "Password update failed.")
    }
    message.textContent = "Password updated successfully."
    message.style.color = "green"

    form.reset()
  } catch(err){
    message.textContent = err.message
    message.style.color ="red"
  }
})


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
        const picsArray = Array.isArray(pfps) ? pfps : [];

        // Clear existing options
        pfpSelect.innerHTML = "";

        // Handle empty array
        if (picsArray.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No profile pictures available";
            option.disabled = true;
            pfpSelect.appendChild(option);
            return;
        }

        // Loop over array safely
        picsArray.forEach(pfp => {
            // Determine the actual path
            let pfpPath = typeof pfp === "string" ? pfp : pfp?.url;
            let pfpName = typeof pfp === "string" ? null : pfp?.name;

            if (!pfpPath) return; // Skip invalid entries

            const option = document.createElement("option");
            option.value = pfpPath;

            // Determine display name
            if (pfpPath.startsWith("data:image/")) {
                option.textContent = pfpName || "Custom Image";
            } else {
                const name = pfpPath.split("/").pop().split(".")[0];
                option.textContent = pfpName || name.charAt(0).toUpperCase() + name.slice(1);
            }

            pfpSelect.appendChild(option);
        });
        

        
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
            document.querySelector(".profile-pic").src = selectedPFP;
        }

        profileMessage.textContent = "Profile updated successfully!";
        profileMessage.style.color = "green";
        modal.style.display = "none";
    } catch (err) {
        profileMessage.textContent = err.message;
        profileMessage.style.color = "red";
    }
});
