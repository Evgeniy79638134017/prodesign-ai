// Курсор-кисточка с шлейфом искр. Палитра сайта: бирюза #508da1, янтарь #ffbe49.
// Только для устройств с мышью; уважает prefers-reduced-motion.
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // холст поверх всего, клики пропускает
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W, H;
  const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  fit();
  addEventListener('resize', fit);

  const COLORS = ['#c8a24b', '#e8d6ab', '#8a9b74', '#fdfaf4'];
  const parts = [];
  let lastX = -1, lastY = -1;

  addEventListener('pointermove', (e) => {
    // искры рождаются вдоль движения, а не пачкой в точке
    const n = lastX < 0 ? 1 : Math.min(4, Math.ceil(Math.hypot(e.clientX - lastX, e.clientY - lastY) / 14));
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 1 : i / n;
      const x = lastX < 0 ? e.clientX : lastX + (e.clientX - lastX) * t;
      const y = lastY < 0 ? e.clientY : lastY + (e.clientY - lastY) * t;
      if (parts.length < 90) {
        parts.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9 - 0.35, // чуть вверх, как пыльца
          r: 1.2 + Math.random() * 2.2,
          life: 1,
          decay: 0.02 + Math.random() * 0.025,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          spin: Math.random() * Math.PI,
        });
      }
    }
    lastX = e.clientX; lastY = e.clientY;
  }, { passive: true });

  function star(x, y, r, rot) {
    // четырёхлучевая искра
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 === 0 ? r : r * 0.38;
      const a = rot + (i * Math.PI) / 4;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.008;
      p.life -= p.decay;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      star(p.x, p.y, p.r * p.life + 0.4, p.spin + p.life * 2);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })();
})();
