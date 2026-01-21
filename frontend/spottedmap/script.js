
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






const panel = document.getElementById("filterPanel");
const btn = document.querySelector(".map-filter-btn");
const slider = document.getElementById("proximity");
const sliderValue = document.getElementById("proximityValue");
const clearBtn = document.getElementById("clearFilters");
const chips = Array.from(document.querySelectorAll(".filter-chip"));

// Open/close panel
btn.addEventListener("click", () => {
  const isOpen = panel.classList.toggle("open");
  panel.setAttribute("aria-hidden", String(!isOpen));
  btn.setAttribute("aria-expanded", String(isOpen));
});

// Slider live value
slider.addEventListener("input", () => {
  sliderValue.textContent = slider.value;
});

// Multi-select chips
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("selected");
    const pressed = chip.classList.contains("selected");
    chip.setAttribute("aria-pressed", String(pressed));
  });
});

// Clear filters to defaults
clearBtn.addEventListener("click", () => {
  slider.value = 0;
  sliderValue.textContent = "0";

  chips.forEach(chip => {
    chip.classList.remove("selected");
    chip.setAttribute("aria-pressed", "false");
  });
});

// (Optional) Close panel if you click outside it
document.addEventListener("click", (e) => {
  if (!panel.classList.contains("open")) return;
  if (panel.contains(e.target) || btn.contains(e.target)) return;

  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  btn.setAttribute("aria-expanded", "false");
});
