// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
});

function animateRing() {
  rx += (mx - rx - 18) * 0.12;
  ry += (my - ry - 18) * 0.12;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

// Scale cursor on hoverable elements
document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '55px';
    ring.style.height = '55px';
    ring.style.borderColor = 'rgba(0,229,255,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'rgba(0,229,255,0.4)';
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--accent)'
      : 'var(--muted)';
  });
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(msg, success = true) {
  toast.textContent = msg;
  toast.style.borderColor = success ? 'var(--accent)' : '#ff4d6d';
  toast.style.color = success ? 'var(--accent)' : '#ff4d6d';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        showToast('✅ Message sent!');
        form.reset();
      } else {
        showToast('❌ Something went wrong.', false);
      }
    } catch (err) {
      showToast('❌ Could not reach server.', false);
    }

    btn.textContent = 'Send Message →';
    btn.disabled = false;
  });
}