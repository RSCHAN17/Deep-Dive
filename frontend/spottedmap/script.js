<script>
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
</script>