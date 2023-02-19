import { App } from '@gui/app';

const container = document.getElementById('game-container');
let app = new App(container);
app.mount().catch(err => {
  console.error(err);
  app.unmount();
  app = null;
});
