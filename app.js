'use strict';
(() => {
  const hero = document.querySelector('.hero');
  const intro = document.getElementById('intro-video');
  const background = document.getElementById('background-video');
  const title = document.getElementById('hero-title');
  const start = document.getElementById('start-video');
  const toggle = document.getElementById('toggle-video');
  const skip = document.getElementById('skip-intro');
  const replay = document.getElementById('replay-intro');
  const playIcon = document.getElementById('play-icon');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pausedByUser = reducedMotion;
  let phase = 'intro';
  let heroVisible = true;
  let fadeTimer;
  // background.mp4 is encoded at 3× the original dexforesight_demo.mp4.
  const activeVideo = () => phase === 'intro' ? intro : background;
  function updatePlaybackUI() {
    const paused = activeVideo().paused;
    playIcon.setAttribute('href', paused ? '#i-play' : '#i-pause');
    toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    hero.classList.toggle('is-paused', paused);
  }
  async function safePlay(video) {
    if (pausedByUser || !heroVisible || document.hidden) return;
    try { await video.play(); start.hidden = true; }
    catch { if (phase === 'intro') start.hidden = false; }
    updatePlaybackUI();
  }
  function showTitle() {
    if (phase === 'title') return;
    phase = 'title';
    hero.dataset.phase = 'title';
    title.setAttribute('aria-hidden', 'false');
    skip.hidden = true; replay.hidden = false; start.hidden = true;
    background.currentTime = 0;
    if (!reducedMotion || !pausedByUser) safePlay(background);
    fadeTimer = setTimeout(() => intro.pause(), 1300);
    updatePlaybackUI();
  }
  function replayIntro() {
    clearTimeout(fadeTimer);
    phase = 'intro'; hero.dataset.phase = 'intro';
    title.setAttribute('aria-hidden', 'true');
    background.pause(); intro.currentTime = 0;
    pausedByUser = false; skip.hidden = false; replay.hidden = true;
    document.getElementById('intro-progress').style.width = '0%';
    updateTime(); safePlay(intro);
  }
  function updateTime() {
    if (phase !== 'intro') return;
    const duration = Number.isFinite(intro.duration) ? intro.duration : 16.13;
    document.getElementById('intro-progress').style.width = `${Math.min(100, intro.currentTime / duration * 100)}%`;
  }
  intro.addEventListener('ended', showTitle);
  intro.addEventListener('timeupdate', updateTime);
  intro.addEventListener('loadedmetadata', updateTime);
  intro.addEventListener('error', showTitle);
  skip.addEventListener('click', showTitle);
  replay.addEventListener('click', replayIntro);
  start.addEventListener('click', () => {pausedByUser = false; safePlay(intro);});
  toggle.addEventListener('click', () => {
    const video = activeVideo();
    if (video.paused) {pausedByUser = false; safePlay(video);}
    else {pausedByUser = true; intro.pause(); background.pause(); updatePlaybackUI();}
  });
  [intro,background].forEach(video => {video.muted = true; video.addEventListener('play', updatePlaybackUI);video.addEventListener('pause', updatePlaybackUI);});
  if (reducedMotion) {intro.pause(); showTitle();} else safePlay(intro);
  const topbar = document.getElementById('topbar');
  function onScroll() {topbar.classList.toggle('is-scrolled', scrollY > hero.offsetHeight - 68);}
  addEventListener('scroll', onScroll, {passive: true}); onScroll();
  const heroObserver = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (!heroVisible) {intro.pause();background.pause();} else safePlay(activeVideo());
  }, {threshold: 0.05});
  heroObserver.observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {intro.pause();background.pause();} else safePlay(activeVideo());
  });
  const sections = Array.from(document.querySelectorAll('.article-section'));
  const outlineLinks = Array.from(document.querySelectorAll('.contents nav a'));
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    const currentId = visible[0].target.id;
    outlineLinks.forEach(link => {if (link.hash === `#${currentId}`) link.setAttribute('aria-current', 'location');else link.removeAttribute('aria-current');});
  }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
  sections.forEach(section => sectionObserver.observe(section));
  document.querySelectorAll('.mobile-contents a').forEach(link => link.addEventListener('click', () => document.querySelector('.mobile-contents').removeAttribute('open')));
  document.querySelectorAll('[data-task][data-speed]').forEach(button => button.addEventListener('click', () => {
    const video = document.getElementById(button.dataset.task);
    video.playbackRate = Number(button.dataset.speed);
    button.closest('.task-speed').querySelectorAll('[data-speed]').forEach(other => other.setAttribute('aria-pressed',String(other === button)));
  }));
  // Keep simultaneous demonstrations from competing for the visitor's attention.
  const taskVideos = Array.from(document.querySelectorAll('.task-video'));
  taskVideos.forEach(video => video.addEventListener('play', () => {
    taskVideos.forEach(other => { if (other !== video) other.pause(); });
  }));
  const dialog = document.getElementById('figure-dialog');
  const expanded = document.getElementById('expanded-figure');
  document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click',() => {
    expanded.src=button.dataset.figure;expanded.alt=button.querySelector('img').alt;
    document.getElementById('expanded-caption').textContent=button.closest('figure').querySelector('figcaption').textContent;
    dialog.showModal();document.body.classList.add('dialog-open');
  }));
  const closeDialog = () => dialog.close();
  document.getElementById('close-figure').addEventListener('click',closeDialog);
  dialog.addEventListener('click',event => {if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
  dialog.addEventListener('close',() => document.body.classList.remove('dialog-open'));
  const copy = document.getElementById('copy-citation');
  copy.addEventListener('click',async () => {
    const text=document.getElementById('citation-text').textContent;
    try {
      await navigator.clipboard.writeText(text);
      copy.querySelector('span').textContent='Copied';
      document.getElementById('copy-status').textContent='Citation copied to clipboard.';
      setTimeout(() => {copy.querySelector('span').textContent='Copy';document.getElementById('copy-status').textContent='';},3000);
    } catch {
      const range=document.createRange();range.selectNodeContents(document.getElementById('citation-text'));
      const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
      document.getElementById('copy-status').textContent='Citation selected. Press Ctrl+C (or ⌘C on Mac) to copy.';
    }
  });
})();
