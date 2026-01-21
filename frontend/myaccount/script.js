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

editBtn.addEventListener("click", () => {
  modal.style.display = "flex"; 
});


closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});


window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Save button placeholder
document.getElementById("save-profile").addEventListener("click", () => {
  // read-only
  const title = document.getElementById("edit-title").value;
  const profilePic = document.getElementById("edit-profile-pic").value;

 

  document.querySelector(".usertitle").textContent = title;
  document.querySelector(".profile-pic").src = `../assets/${profilePic}`;

  modal.style.display = "none"; 
});