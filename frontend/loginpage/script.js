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
    window.location.href = "./"
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

const savedUsername = localStorage.getItem("prefillUsername")
const usernameInput = document.querySelector("#username")

if (savedUsername && usernameInput) {
    usernameInput.value = savedUsername
    localStorage.removeItem("prefillUsername")
}

const API_BASE = "https://spotting-api.onrender.com"

const passwordInput = document.querySelector("#password")
const submitBtn = document.querySelector("#submit")
const errorMessage = document.querySelector('#error')

submitBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim()
    const password = passwordInput.value
    

    if (!username || !password) {
        errorMessage.textContent = ("Please enter username and password")
        return
    }

    submitBtn.disabled = true

    try {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })

        const data = await res.json().catch(() => null)
        console.log("Login response data:", data);

        if (!res.ok) {
            const errMsg =
                (data && (data.error || data.message)) ||
                `Login failed (HTTP ${res.status})`
            alert(errMsg)
            return
        }
        const currentUser = {
            user_id:data.user.user_id,
            username: data.user.username,
            token: data.token
        }
        
        localStorage.setItem("currentUser", JSON.stringify(data))
        localStorage.setItem("token", data.token)
        localStorage.setItem("user_id", data.user.user_id)
        localStorage.setItem("username", data.user.username)


 
        window.location.href = "../landingpage/index.html"

    } catch (err) {
        console.error(err)
        alert("Network error")
    } finally {
        submitBtn.disabled = false
    }
})

const signUpBtn = document.getElementById("signupbtn")
signUpBtn.addEventListener('click', () => {
    window.location.href=("../registerpage/index.html")
})

