// Perfectly-synced infinite draw loop (no drifting)
(function () {
  const svg = document.querySelector(".logoDraw");
  if (!svg) return;

  const fillLayer = svg.querySelector(".fillLayer");
  if (!fillLayer) return;

  // Create stroke layer once (clone fill geometry)
  const strokeLayer = fillLayer.cloneNode(true);
  strokeLayer.classList.remove("fillLayer");
  strokeLayer.classList.add("strokeLayer");
  svg.appendChild(strokeLayer);

  const strokePaths = Array.from(strokeLayer.querySelectorAll("path"));
  const fillPaths = Array.from(fillLayer.querySelectorAll("path"));

  // Timing (tweak these)
  const drawDur = 900; // ms per path
  const stagger = 540; // ms between paths
  const fadeDur = 350; // ms fade in/out
  const pause = 1850; // ms pause after finished

  // Match stroke colors to fill colors
  strokePaths.forEach((p, i) => {
    const fill = getComputedStyle(fillPaths[i]).fill;
    p.style.stroke = fill;
  });

  // Precompute path lengths
  const lengths = strokePaths.map((p) => p.getTotalLength());

  function reset() {
    strokePaths.forEach((p) => p.getAnimations().forEach((a) => a.cancel()));
    fillLayer.getAnimations().forEach((a) => a.cancel());
    strokeLayer.getAnimations().forEach((a) => a.cancel());

    fillLayer.style.opacity = "0";
    strokeLayer.style.opacity = "1";

    strokePaths.forEach((p, i) => {
      const len = lengths[i];
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function loop() {
    while (true) {
      reset();

      strokePaths.forEach((p, i) => {
        p.animate([{ strokeDashoffset: lengths[i] }, { strokeDashoffset: 0 }], {
          duration: drawDur,
          delay: i * stagger,
          easing: "ease",
          fill: "forwards",
        });
      });

      const totalDrawTime = (strokePaths.length - 1) * stagger + drawDur;
      await sleep(Math.max(0, totalDrawTime - 120));

      fillLayer.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fadeDur,
        easing: "ease",
        fill: "forwards",
      });
      strokeLayer.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: fadeDur,
        easing: "ease",
        fill: "forwards",
      });

      await sleep(fadeDur + pause);
    }
  }

  loop();
})();
