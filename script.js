// CONFIGURACIÓN: cambia este número por la cantidad real de imágenes de tu manga.
const TOTAL_PAGINAS = 19;
// Archivos esperados: manga/01.png, manga/02.png, ...
const EXTENSION = 'png';

const inicio = document.querySelector('#inicio');
const lectura = document.querySelector('#lectura');
const birds = document.querySelector('#birds');
const intro = document.querySelector('#intro');
const music = document.querySelector('#music');
const musicBtn = document.querySelector('#musicBtn');
const pages = document.querySelector('#pages');
let timers = [];

function later(fn, ms) { const id = setTimeout(fn, ms); timers.push(id); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pigeonSVG = `<svg viewBox="0 0 120 116" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="feather" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c6d4dd"/><stop offset=".55" stop-color="#8e9fae"/><stop offset="1" stop-color="#657587"/></linearGradient><linearGradient id="neck" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#428d86"/><stop offset="1" stop-color="#665d92"/></linearGradient></defs>
<ellipse cx="61" cy="106" rx="33" ry="5" fill="#27273e" opacity=".23"/>
<path d="M37 78 15 87 32 66" fill="#778898"/><path d="M52 83 51 103 M72 82 75 103" stroke="#c45b5e" stroke-width="3" stroke-linecap="round"/><path d="m47 103-7 2m12-2 6 2m17-2-6 2m6-2 7 2" stroke="#c45b5e" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="58" cy="70" rx="35" ry="24" fill="url(#feather)" stroke="#667b90" stroke-width="1.5"/>
<g class="wing"><path d="M45 72 Q12 47 32 28 Q59 30 82 70 Q60 84 45 72Z" fill="#aebdc9" stroke="#61788d" stroke-width="2"/><path d="M38 38 Q53 49 63 73 M45 34 Q63 50 72 71" fill="none" stroke="#748a9e" stroke-width="3" stroke-linecap="round"/></g>
<path d="M75 71 Q67 48 73 32 Q79 19 92 23 Q105 29 97 43 L90 72Z" fill="url(#neck)"/>
<circle cx="88" cy="28" r="17" fill="#a9bac8" stroke="#778c9e" stroke-width="1.5"/><circle cx="96" cy="25" r="4.5" fill="#fff"/><circle cx="97" cy="25" r="2.4" fill="#1d2734"/><path d="m103 32 13 5-14 5" fill="#edb78c" stroke="#bc8b70" stroke-width="1"/>
<path d="M81 54 Q89 60 92 68" stroke="#c4d5d9" stroke-width="3" fill="none" opacity=".6"/></svg>`;
function makeBirds() {
  birds.replaceChildren();
  const count = reduceMotion ? 8 : Math.min(24, Math.max(12, Math.round(window.innerWidth / 44)));
  for (let i = 0; i < count; i++) {
    const bird = document.createElement('div');
    bird.className = 'bird';
    bird.innerHTML = pigeonSVG.replaceAll('id="feather"',`id="feather${i}"`).replaceAll('url(#feather)',`url(#feather${i})`).replaceAll('id="neck"',`id="neck${i}"`).replaceAll('url(#neck)',`url(#neck${i})`);
    const x = 10 + Math.random() * 80;
    const y = 76 + Math.random() * 19;
    const scale = .55 + ((y - 76) / 19) * .68;
    bird.style.setProperty('--x', `${x}%`);
    bird.style.setProperty('--y', `${y}%`);
    bird.style.setProperty('--size', `${Math.round(66 * scale)}px`);
    bird.style.setProperty('--flip', Math.random() > .5 ? 1 : -1);
    bird.style.setProperty('--speed', `${.75 + Math.random() * 1.15}s`);
    bird.style.setProperty('--delay', `${Math.random() * 1.05}s`);
    bird.style.setProperty('--flytime', `${1.45 + Math.random() * .9}s`);
    bird.style.setProperty('--drift', `${-230 + Math.random() * 460}px`);
    bird.style.setProperty('--rise', `${-Math.round(window.innerHeight * (1.2 + Math.random() * .55))}px`);
    bird.style.zIndex = String(Math.round(y * 10));
    birds.append(bird);
  }
}
function makeCrumbs() {
  const ground = document.querySelector('.crumbs');
  ground.replaceChildren();
  for (let i = 0; i < 46; i++) {
    const c = document.createElement('span');
    c.className = 'crumb';
    c.style.setProperty('--x', `${10 + Math.random() * 80}%`);
    c.style.setProperty('--y', `${78 + Math.random() * 18}%`);
    ground.append(c);
  }
}
function makePetals() {
  const petals = document.querySelector('#petals');
  petals.replaceChildren();
  if (reduceMotion) return;
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--px', `${Math.random() * 100}%`);
    petal.style.setProperty('--pd', `${Math.random() * -12}s`);
    petal.style.setProperty('--pt', `${8 + Math.random() * 8}s`);
    petal.style.setProperty('--sway', `${-110 + Math.random() * 220}px`);
    petals.append(petal);
  }
}
function surprise() {
  birds.querySelectorAll('.bird').forEach(b => b.classList.add('fly'));
  document.querySelector('.scene').classList.add('takeoff');
  later(() => intro.classList.add('visible'), reduceMotion ? 200 : 1450);
}
function startIntro() {
  clearTimers();
  intro.classList.remove('visible');
  document.querySelector('.scene').classList.remove('takeoff');
  makeBirds(); makeCrumbs(); makePetals();
  later(surprise, reduceMotion ? 400 : 4800);
}
function loadPages() {
  pages.replaceChildren();
  if (TOTAL_PAGINAS < 1) {
    const placeholder = document.createElement('div');
    placeholder.className = 'page-placeholder';
    placeholder.innerHTML = '<div><h3>📖 Aquí aparecerá tu manga</h3><p>Coloca tus imágenes en la carpeta <strong>manga</strong> y cambia <strong>TOTAL_PAGINAS</strong> en script.js.</p></div>';
    pages.append(placeholder);
    return;
  }
  for (let i = 1; i <= TOTAL_PAGINAS; i++) {
    const img = document.createElement('img');
    img.className = 'manga-page';
    img.src = `manga/${String(i).padStart(2, '0')}.${EXTENSION}`;
    img.alt = `Página ${i} del manga de Miriam`;
    img.loading = i <= 2 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.onerror = () => {
      const error = document.createElement('div');
      error.className = 'page-placeholder';
      error.textContent = `No se encontró ${img.src.split('/').pop()}. Revisa el nombre del archivo.`;
      img.replaceWith(error);
    };
    pages.append(img);
  }
}
function openLetter() {
  clearTimers();
  inicio.classList.add('hidden');
  lectura.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  music.play().then(() => musicBtn.textContent = '♫ Pausar').catch(() => musicBtn.textContent = '♫ Activar música');
}
function restart() {
  music.pause(); music.currentTime = 0;
  musicBtn.textContent = '♫ Música';
  lectura.classList.add('hidden');
  inicio.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
  startIntro();
}
document.querySelector('#skip').addEventListener('click', () => { clearTimers(); surprise(); });
document.querySelector('#letter').addEventListener('click', openLetter);
document.querySelector('#restart').addEventListener('click', restart);
musicBtn.addEventListener('click', () => {
  if (music.paused) music.play().then(() => musicBtn.textContent = '♫ Pausar').catch(() => alert('Añade el archivo musica/cumpleanos.mp3 para escuchar la canción.'));
  else { music.pause(); musicBtn.textContent = '♫ Reproducir'; }
});
loadPages();
startIntro();
