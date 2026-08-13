// Анастасия Ищенко — дизайнер интерьера. Минимальный ванильный JS.

// шапка: фон при скролле
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// бургер
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );
}

// слайдеры: стрелки листают на ширину видимой области
document.querySelectorAll('.slider').forEach((slider) => {
  const track = slider.querySelector('.slider__track');
  slider.querySelectorAll('.slider__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.classList.contains('slider__btn--next') ? 1 : -1;
      track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: 'smooth' });
    });
  });
});

// лайтбокс: собирает все фото внутри одного слайдера
const lb = document.querySelector('.lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  const lbCounter = lb.querySelector('.lightbox__counter');
  let group = [];
  let idx = 0;

  const show = (i) => {
    idx = (i + group.length) % group.length;
    lbImg.src = group[idx].dataset.full || group[idx].src;
    lbImg.alt = group[idx].alt || '';
    lbCounter.textContent = (idx + 1) + ' / ' + group.length;
  };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

  document.querySelectorAll('.slider__track').forEach((track) => {
    const imgs = [...track.querySelectorAll('img')];
    imgs.forEach((img, i) => {
      img.addEventListener('click', () => {
        group = imgs;
        show(i);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  });

  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}
