// src/utils/scrollTop.js
export function forceTop() {
  // Stop the browser from restoring scroll
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const docEl = document.scrollingElement || document.documentElement;
  const root = document.getElementById('root');

  const jump = () => {
    window.scrollTo(0, 0);
    docEl.scrollTop = 0;
    document.body.scrollTop = 0;
    if (root) root.scrollTop = 0;   // if your app scrolls inside #root
  };

  // run now, next frame, and shortly after layout/images
  jump();
  requestAnimationFrame(jump);
  setTimeout(jump, 0);
  setTimeout(jump, 60);
}
