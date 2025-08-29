// ===== Mobile Nav Toggle =====
const hamburger = document.getElementById('hamburgerBtn');
const nav = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
  nav.classList.toggle('show');
});

// Close nav when clicking a link (mobile)
nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ===== Intersection Observer (fade-in) =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{ threshold: 0.18 });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

// ===== Portfolio Filtering =====
const buttons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
      } else {
        const cats = (card.dataset.category || '').split(' ');
        card.style.display = cats.includes(filter) ? '' : 'none';
      }
    });
  });
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
