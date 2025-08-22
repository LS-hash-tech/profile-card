(function () {
  const slider = document.getElementById("slider");
  const track = slider.querySelector(".slider-main-functions");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".slider-button-previous");
  const nextBtn = slider.querySelector(".slider-button-next"); // fixed
  const dotsNav = slider.querySelector(".slider-dots");

  let current = 0;
  let startX = 0;
  let moveX = 0;
  let isDragging = false;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.dataset.index = i;
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dotsNav.appendChild(dot);
  });

  function update() {
    const width = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${current * width}px)`;
    Array.from(dotsNav.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
    slides.forEach((s, i) => s.setAttribute("aria-hidden", i !== current));
  }

  // Buttons
  prevBtn.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    update();
  });

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    update();
  });

  // Dots navigation
  dotsNav.addEventListener("click", (e) => {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    current = Number(dot.dataset.index);
    update();
  });

  // Keyboard arrows
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  });

  // Handle window resize
  window.addEventListener("resize", update);

  // Touch swipe
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = "none";
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    moveX = e.touches[0].clientX - startX;
    const width = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(${-current * width + moveX}px)`;
  });

  track.addEventListener("touchend", () => {
    isDragging = false;
    const threshold = 50;
    if (moveX > threshold) current = Math.max(0, current - 1);
    else if (moveX < -threshold)
      current = Math.min(slides.length - 1, current + 1);
    track.style.transition = "";
    moveX = 0;
    update();
  });

  // Initial render
  update();
})();
