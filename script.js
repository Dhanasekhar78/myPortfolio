'use strict';

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top <= 90) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    }
  });
});

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ===== SKILL BARS ===== */
const skillsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 150);
      });
      skillsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });

const skillsSec = document.getElementById('skills');
if (skillsSec) skillsObs.observe(skillsSec);

/* ===== STAT COUNTERS ===== */
function countUp(el, target, isFloat) {
  const dur = 1600;
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = isFloat ? (eased * target).toFixed(1) : Math.round(eased * target);
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

let statsDone = false;
function tryStats() {
  if (statsDone) return;
  const hero = document.getElementById('home');
  if (!hero) return;
  if (hero.getBoundingClientRect().top < window.innerHeight) {
    statsDone = true;
    document.querySelectorAll('.hstat-num').forEach(el => {
      const t = parseFloat(el.dataset.target);
      countUp(el, t, el.dataset.float === 'true');
    });
  }
}
window.addEventListener('scroll', tryStats, { passive: true });
setTimeout(tryStats, 400);

/* ===== BACK TO TOP ===== */
const btt = document.getElementById('back-to-top');
function toggleBackToTop() {
  btt.classList.toggle('visible', window.scrollY > 400);
}
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));



/* ===== DYNAMIC YEARS OF EXPERIENCE ===== */
function updateDynamicExperience() {
  const startDate = new Date('2023-11-01');
  const today = new Date();
  const diffTime = today - startDate;
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  const yoeFormatted = Math.max(0, diffYears).toFixed(1);

  document.querySelectorAll('.dynamic-exp-years').forEach(el => {
    el.textContent = yoeFormatted;
  });

  const expStat = document.getElementById('exp-stat-num');
  if (expStat) {
    expStat.dataset.target = yoeFormatted;
    expStat.dataset.float = 'true';
  }
}

// Initialize dynamic experience calculation
updateDynamicExperience();
