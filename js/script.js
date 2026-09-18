'use strict';

const config = window.SITE_CONFIG || {};
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const dialog = document.querySelector('#detail-dialog');
const detailTitle = document.querySelector('#detail-title');
const detailBody = document.querySelector('#detail-body');
let dialogTrigger;

function setMenu(open) {
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menuToggle.querySelector('use').setAttribute('href', open ? '#icon-x' : '#icon-menu');
}
menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 1021px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

// A navegação acompanha também a rolagem manual.
const sections = [...document.querySelectorAll('main section[id]')];
let scheduled = false;
function updateActiveSection() {
  let current = 'inicio';
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= Math.min(innerHeight * .3, 220)) current = section.id;
  }
  nav.querySelectorAll('a').forEach(link => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveSection); }
}, { passive: true });
updateActiveSection();

// Nenhum número fictício ou link de compartilhamento é usado como agendamento.
const whatsappNumber = String(config.whatsapp || '').replace(/\D/g, '');
const hasWhatsapp = /^\d{10,15}$/.test(whatsappNumber);
function contactUrl(topic = 'consulta') {
  if (!hasWhatsapp) return config.instagram || 'https://www.instagram.com/brunapiresnutricionista/';
  const message = topic === 'palestra'
    ? 'Olá, Dra. Bruna! Gostaria de informações para organizar uma palestra.'
    : 'Olá, Dra. Bruna! Gostaria de saber mais sobre o atendimento e agendar uma consulta.';
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
function externalLink(link, url) {
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
}
if (hasWhatsapp) {
  document.querySelectorAll('[data-appointment]').forEach(link => {
    externalLink(link, contactUrl());
    link.querySelector('use')?.setAttribute('href', '#icon-whatsapp');
  });
  const mainContact = document.querySelector('[data-contact-main]');
  externalLink(mainContact, contactUrl());
  mainContact.querySelector('use').setAttribute('href', '#icon-whatsapp');
  mainContact.querySelector('span').textContent = 'Falar pelo WhatsApp';
  document.querySelector('[data-whatsapp-row]').hidden = false;
  externalLink(document.querySelector('[data-whatsapp]'), contactUrl());
  const phone = document.querySelector('[data-phone]');
  phone.href = `tel:+${whatsappNumber}`;
  phone.textContent = config.phoneDisplay || `+${whatsappNumber}`;
  document.querySelector('[data-phone-row]').hidden = false;
}
if (config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
  const email = document.querySelector('[data-email]');
  email.href = `mailto:${config.email}`;
  email.textContent = config.email;
  document.querySelector('[data-email-row]').hidden = false;
}
if (config.address) {
  document.querySelector('[data-address]').textContent = config.address;
  const map = document.querySelector('[data-location]');
  externalLink(map, config.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address)}`);
  map.firstChild.textContent = 'Como chegar ';
  if (config.mapsEmbedUrl) {
    const mapFrame = document.querySelector('[data-map-frame]');
    mapFrame.src = config.mapsEmbedUrl;
    mapFrame.hidden = false;
    document.querySelector('#location-panel').classList.add('has-map');
  }
}
document.querySelectorAll('[data-inquiry]').forEach(link => {
  if (hasWhatsapp) externalLink(link, contactUrl('palestra'));
});

const serviceDetails = {
  neuro: {
    title: 'Neuronutrição no TEA e TDAH',
    text: 'Um acompanhamento que considera a história, as preferências e a rotina de cada criança. O cuidado nutricional é individualizado e construído em parceria com a família.',
    items: ['Escuta da família e avaliação da rotina alimentar.', 'Objetivos possíveis para o dia a dia.', 'Acompanhamento respeitoso em cada etapa.']
  },
  terapia: {
    title: 'Terapia alimentar',
    text: 'Como terapeuta alimentar, acolho a seletividade, a recusa e as dificuldades nas refeições. O trabalho propõe uma aproximação gradual com os alimentos, respeitando o ritmo da criança e construindo novas experiências junto à família.',
    items: ['Compreensão da história alimentar, das preferências e dos desafios.', 'Exploração de alimentos, texturas e sabores sem pressão.', 'Orientações para dar continuidade às descobertas no dia a dia.']
  },
  suplementacao: {
    title: 'Suplementação alimentar',
    text: 'Cada criança tem necessidades próprias. O acompanhamento inclui avaliar a alimentação, o histórico e, quando necessário, os exames para entender se há indicação de suplementação e orientar esse cuidado de forma individualizada.',
    items: ['Avaliação das necessidades nutricionais e da rotina alimentar.', 'Orientação sobre suplementação quando indicada na avaliação.', 'Acompanhamento e reavaliação ao longo do cuidado.']
  },
  familias: {
    title: 'Orientação para famílias',
    text: 'Informação clara e orientação prática para tornar o cuidado com a alimentação parte de uma rotina possível. Um trabalho construído junto com quem cuida.',
    items: ['Espaço para conversar e esclarecer dúvidas.', 'Organização de uma rotina que faça sentido para a família.', 'Acolhimento para responsáveis e cuidadores.']
  }
};
const talks = {
  tea: { title: 'Nutrição e comportamento no TEA', text: 'Uma conversa para famílias, educadores e equipes sobre alimentação, desenvolvimento e a importância de olhar para cada criança de forma individual.' },
  seletividade: { title: 'Seletividade alimentar: é possível avançar?', text: 'Um encontro sobre os desafios da seletividade alimentar, o papel de quem cuida e a construção de experiências mais acolhedoras à mesa.' },
  infancia: { title: 'Alimentação na infância: mais leve, mais real', text: 'Uma palestra sobre os desafios reais da rotina alimentar, com espaço para reflexão, troca e orientação para famílias e educadores.' }
};
function paragraph(text) {
  const element = document.createElement('p');
  element.textContent = text;
  return element;
}
function showDetail(data, trigger, isTalk = false, key = '') {
  dialogTrigger = trigger;
  document.querySelector('#detail-label').textContent = isTalk ? 'Palestras e eventos' : 'Cuidado individualizado';
  detailTitle.textContent = data.title;
  detailBody.replaceChildren(paragraph(data.text));
  if (data.items) {
    const list = document.createElement('ul');
    data.items.forEach(text => { const li = document.createElement('li'); li.textContent = text; list.append(li); });
    detailBody.append(list);
  }
  const videoSource = isTalk && config.videos?.[key];
  if (videoSource && /^https?:\/\//i.test(videoSource)) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = videoSource;
    detailBody.append(video);
  } else if (isTalk) {
    detailBody.append(paragraph('O conteúdo do encontro pode ser adaptado ao público da sua escola, empresa ou evento. Entre em contato para conversar sobre a proposta.'));
  }
  const cta = document.querySelector('#detail-cta');
  cta.firstChild.textContent = isTalk ? 'Solicitar esta palestra ' : 'Conversar sobre o atendimento ';
  externalLink(cta, contactUrl(isTalk ? 'palestra' : 'consulta'));
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
document.querySelectorAll('[data-detail]').forEach(button => {
  button.addEventListener('click', () => showDetail(serviceDetails[button.dataset.detail], button));
});
document.querySelectorAll('[data-talk]').forEach(button => {
  button.addEventListener('click', () => showDetail(talks[button.dataset.talk], button, true, button.dataset.talk));
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  dialog.querySelector('video')?.pause();
  document.body.classList.remove('dialog-open');
  dialogTrigger?.focus({ preventScroll: true });
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Contagem executada uma única vez quando os indicadores entram na tela.
// O texto acessível e os valores sem JavaScript permanecem completos no HTML.
function initializeCounters() {
  const stats = document.querySelector('.stats');
  const counters = [...document.querySelectorAll('[data-count]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!stats || !counters.length || reducedMotion.matches || !('IntersectionObserver' in window)) return;

  let frame = 0;
  const duration = 1600;
  const format = new Intl.NumberFormat('pt-BR');
  const render = (counter, value) => {
    counter.textContent = `+${format.format(value)}${counter.dataset.suffix || ''}`;
  };
  const finish = () => {
    cancelAnimationFrame(frame);
    counters.forEach(counter => render(counter, Number(counter.dataset.count)));
    stats.classList.remove('is-counting');
    observer.disconnect();
    reducedMotion.removeEventListener('change', onMotionChange);
  };
  function onMotionChange(event) { if (event.matches) finish(); }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    stats.classList.add('is-counting');
    counters.forEach(counter => render(counter, 0));
    const start = performance.now();
    const tick = now => {
      counters.forEach((counter, index) => {
        const progress = Math.min(1, Math.max(0, (now - start - index * 110) / duration));
        const eased = 1 - Math.pow(1 - progress, 3);
        render(counter, Math.round(Number(counter.dataset.count) * eased));
      });
      if (now - start < duration + (counters.length - 1) * 110) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
  }, { threshold: .5 });
  reducedMotion.addEventListener('change', onMotionChange);
  observer.observe(stats);
}
initializeCounters();

// Um único quadro por movimento de ponteiro; nenhum efeito contínuo em repouso.
function initializeCardLights() {
  const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  document.querySelectorAll('.glow-card').forEach(card => {
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty('--glow-x');
      card.style.removeProperty('--glow-y');
    };
    card.addEventListener('pointermove', event => {
      if (!enabled.matches || event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', `${pointerX - bounds.left}px`);
        card.style.setProperty('--glow-y', `${pointerY - bounds.top}px`);
        frame = 0;
      });
    });
    card.addEventListener('pointerleave', reset);
    enabled.addEventListener('change', reset);
  });
}
initializeCardLights();
