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
    window.location.href = "../loginpage/index.html"
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

const API_BASE = "https://spotting-api.onrender.com"

const usernameEl = document.querySelector("#username")
const emailEl = document.querySelector("#email_address")
const passwordEl = document.querySelector("#password")
const confirmPasswordEl = document.querySelector("#confirm_password")
const submitBtn = document.querySelector("#submit")

submitBtn.addEventListener("click", async () => {
    const username = usernameEl.value.trim()
    const email_address = emailEl.value.trim()
    const password = passwordEl.value
    const confirm_password = confirmPasswordEl.value

    if (!username || !email_address || !password || !confirm_password) {
        alert("Please fill in all fields")
        return
    }

    if (password !== confirm_password) {
        alert("Passwrods do not match.")
        return
    }

    submitBtn.disabled = true

    try {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email_address })
        })

        const data = await res.json().catch(() => null)

        if (!res.ok) {
            const errMsg =
                (data && (data.error || data.message)) ||
                `Signup failed (HTTP ${res.status})`
            alert(errMsg)
            return
        }

        
        localStorage.setItem("prefillUsername", username)

        window.location.href = "../loginpage/index.html"

    } catch (err) {
        console.error(err)
        alert("Network error")
    } finally {
        submitBtn.disabled = false
    }
})
