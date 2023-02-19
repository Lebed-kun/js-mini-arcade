// Game entities
import { generateScene } from '@game/scene';
import { GameEngine } from '@core/game-engine';
// Assets
import GameBackgroundTile from '@assets/game-background.png';
import GameTileset from '@assets/tileset.png';
// Components
import { Loader } from '@gui/components/loader';
import { GameTile } from '@gui/components/game-tile';
import { GameScene } from '@gui/components/game-scene';
import { PillsCounter } from '@gui/components/pills-counter';
import { ContinuePopup } from '@gui/components/continue-popup';

export class App {
  private _containerEl: HTMLElement;
  private _loader: Loader;
  private _backgroundTile: GameTile;
  private _spriteSetTile: GameTile;

  private _gameCanvas: GameScene;
  private _scene: GameEngine;

  private _pillsCounter: PillsCounter;

  private _winPopup: ContinuePopup;
  private _failPopup: ContinuePopup;

  constructor(container: HTMLElement) {
    this._containerEl = container;
    this._loader = null;
    this._scene = null;
  }

  private async _loadTile(imageSrc: string) {
    let waitTileResolve: (v: any) => void;
    const waitTile = new Promise(
      (res) => {
        waitTileResolve = res;
      },
    );
    const tile = new GameTile(
      this._containerEl,
      {
        imageSrc,
        // @ts-ignore
        onLoad: waitTileResolve,
      },
    );
    tile.mount();

    await waitTile;
    return tile;
  }

  private async _setupGui() {
    this._gameCanvas = new GameScene(this._containerEl);
    this._gameCanvas.mount();

    await new Promise(
      (res) => {
        window.requestIdleCallback(
          () => {
            res(null);
          },
        )
      },
    );

    this._pillsCounter = new PillsCounter(this._containerEl);
    this._pillsCounter.mount();
  }

  private _onDoorHit() {
    this._scene.pause();

    const continueFn = () => {
      window.open('https://gitlab.com/jbyte777/liberty-pharm-events-distributor', '_blank');
    };
    this._winPopup = new ContinuePopup(
      this._containerEl,
      {
        initText: 'You win =^_^=',
        onContinue: continueFn,
      }
    );
    this._winPopup.mount();
  }

  private _onDie() {
    this._scene.pause();

    const continueFn = () => {
      // ... clean up global event handlers ...
      document.body.innerHTML = `
        <p class="h-text">G3XT3QPDN3BX4DKV4XCHVR5335R2SR1C2</p>
        <p class="h-text">https://gitlab.com/jbyte777/ahs-browser-plugin/-/blob/master/src/utils/smartRandom.js#L51</p>
      `;
    };
    this._failPopup = new ContinuePopup(
      this._containerEl,
      {
        initText: ';\'\'\'\'\'\'3',
        onContinue: continueFn,
      }
    );
    this._failPopup.mount();
  }

  private _onPillCollect(cnt: number) {
    this._pillsCounter.increaseCountBy(cnt);
  }

  private async _setupScene() {
    const bgImage = this._backgroundTile.getImage();
    this._scene = generateScene(
      this._gameCanvas.getCanvas(),
      {
        image: bgImage,
        width: bgImage.width,
        height: bgImage.height,
      },
      this._spriteSetTile.getImage(),
      {
        onDoorHit: () => {
          this._onDoorHit();
        },
        onDie: () => {
          this._onDie();
        },
        onPillCollect: (cnt: number) => {
          this._onPillCollect(cnt);
        },
      }
    );

    await new Promise(
      (res) => {
        window.requestIdleCallback(
          () => {
            res(null);
          },
        )
      },
    );

    this._scene.start();
  }

  public async mount() {
    this._loader = new Loader(
      this._containerEl,
      {
        initText: 'Loading background...',
      },
    );
    this._loader.mount();
    this._backgroundTile = await this._loadTile(GameBackgroundTile);

    this._loader.updateText('Loading sprite set...');
    this._spriteSetTile = await this._loadTile(GameTileset);

    this._loader.updateText('Setup GUI...');
    await this._setupGui();

    this._loader.updateText('Setup game scene...');
    await this._setupScene();

    this._loader.unmount();
    this._loader = null;
  }
}
