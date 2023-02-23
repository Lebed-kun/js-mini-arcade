import { App } from '@gui/app';

export const initApp = () => {
  const container = document.getElementById('game-container');
  let app = new App(container);

  app.mount().catch(err => {
    console.error('error => ', err);
    app.unmount();
    app = null;
  });
};
