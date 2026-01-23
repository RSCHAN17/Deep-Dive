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