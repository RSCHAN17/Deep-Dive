
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
  window.location.href = "../submitspot/index.html"
})
dropDown4.addEventListener("click", () => {
  window.location.href = "../leaderboards/index.html"
})






document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const signInBtn = document.getElementById("signInBtn");
    const submitBtn = document.querySelector("#submitBtn")
    const dropdownBtn = document.querySelector(".dropbtn")
    const dropdown = document.querySelector(".dropdown")

    if (token && signInBtn) {
        
        signInBtn.style.display = "none";
    }
    if (!token && submitBtn) {
        submitBtn.style.display = "none";
    }
    if ((!token || token === "null" || token === "undefined") && dropdownBtn) {
        dropdownBtn.disabled = true;
        dropdownBtn.style.opacity = 0.5;
        dropdownBtn.style.pointerEvents = "none"

        const dropdownContent = dropdown.querySelector(".dropdown-content")
        if (dropdownContent) {
            dropdownContent.style.display = "none"
        }
    }

    
});
