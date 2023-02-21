import { App } from '@gui/app';

export const initApp = () => {
  const container = document.getElementById('game-container');
  let app = new App(container);

  window.addEventListener('error', (e) => {
    console.error(e.error);
    app.unmount();
  });
  app.mount().catch(err => {
    console.error(err);
    app.unmount();
    app = null;
  });
};
