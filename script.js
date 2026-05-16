const layers = [
  ['.mountain', 0.045, 0],
  ['.mountain.front', 0.10, 0],
  ['.hills', 0.16, 0],
  ['.river', 0.25, 13],
  ['.terraces', 0.12, 0],
  ['.village', 0.08, 0]
];

let latestY = 0;
let ticking = false;

function parallax() {
  const y = latestY;
  layers.forEach(([sel, speed, rotate]) => {
    document.querySelectorAll(sel).forEach(el => {
      const drift = Math.sin((y * 0.002) + speed * 20) * 10;
      const rot = rotate ? ` rotate(${rotate}deg)` : '';
      el.style.transform = `translate3d(${drift}px, ${y * speed}px, 0)${rot}`;
    });
  });
  document.documentElement.style.setProperty('--scroll', y.toFixed(0));
  ticking = false;
}

window.addEventListener('scroll', () => {
  latestY = window.scrollY || 0;
  if (!ticking) {
    window.requestAnimationFrame(parallax);
    ticking = true;
  }
}, { passive: true });
parallax();

const chips = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-process]');
chips.forEach(c => c.addEventListener('click', () => {
  chips.forEach(x => x.classList.remove('active'));
  c.classList.add('active');
  const f = c.dataset.filter;
  cards.forEach(card => {
    const show = f === 'all' || card.dataset.process === f;
    card.style.display = show ? '' : 'none';
    if (show) card.animate([{opacity:.35, transform:'translateY(10px)'},{opacity:1, transform:'translateY(0)'}], {duration:260, easing:'ease-out'});
  });
}));

// Coffee-themed scroll marker
const steamCup = document.createElement('div');
steamCup.className = 'scroll-steam';
steamCup.innerHTML = '<span class="steam s1"></span><span class="steam s2"></span><span class="steam s3"></span>';
document.body.appendChild(steamCup);
steamCup.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Soft reveal on scroll
const revealItems = document.querySelectorAll('.glass, .card, .feature, .origin-card, .info-card');
revealItems.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealItems.forEach(el => observer.observe(el));

// Tiny coffee bean burst on CTA clicks/hover-like interaction
function beanBurst(x, y) {
  for (let i = 0; i < 5; i++) {
    const bean = document.createElement('span');
    bean.className = 'bean-trail';
    document.body.appendChild(bean);
    const angle = (-90 + i * 45) * Math.PI / 180;
    const dist = 34 + Math.random() * 28;
    bean.style.left = `${x}px`;
    bean.style.top = `${y}px`;
    bean.animate([
      { transform: 'translate(-50%,-50%) scale(.75) rotate(0deg)', opacity: .95 },
      { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(.35) rotate(${160 + i * 35}deg)`, opacity: 0 }
    ], { duration: 720, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => bean.remove();
  }
}

document.querySelectorAll('.btn, .mini-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    beanBurst(r.left + r.width / 2, r.top + r.height / 2);
  });
});

// Subtle cursor parallax for the background layers; scroll behavior above remains intact.
let pointerX = 0;
let pointerY = 0;
let pointerTick = false;
window.addEventListener('pointermove', (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  if (!pointerTick) {
    window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', pointerX.toFixed(3));
      document.documentElement.style.setProperty('--my', pointerY.toFixed(3));
      const village = document.querySelector('.village');
      if (village) village.style.filter = `drop-shadow(${pointerX * 8}px ${12 + pointerY * 4}px 18px rgba(0,0,0,.38))`;
      pointerTick = false;
    });
    pointerTick = true;
  }
}, { passive: true });

// Align button widths inside grouped CTAs so the interface feels deliberately designed.
document.querySelectorAll('.btns').forEach(group => {
  const buttons = [...group.querySelectorAll('.btn')];
  if (buttons.length > 1 && window.innerWidth > 760) {
    const max = Math.max(...buttons.map(button => button.getBoundingClientRect().width));
    buttons.forEach(button => button.style.minWidth = `${Math.ceil(max)}px`);
  }
});
