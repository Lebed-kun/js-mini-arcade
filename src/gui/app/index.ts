// Game entities
import { generateScene } from '@game/scene';
import { GameEngine } from '@core/game-engine';
import { GAME_SCENEMOUSECLICK_EVENT_ID, GAME_KEYDOWN_EVENT_ID, GAME_KEYUP_EVENT_ID } from '@core/game-event';
// Assets
import GameBackgroundTile from '@assets/game-background.png';
import GameTileset from '@assets/tileset.png';
// Components
import { Loader } from '@gui/components/loader';
import { GameTile } from '@gui/components/game-tile';
import { GameScene } from '@gui/components/game-scene';
import { PillsCounter } from '@gui/components/pills-counter';
import { ContinuePopup } from '@gui/components/continue-popup';
// Consts
import { PERMITTED_KEYS } from './consts';

export class App {
  private _containerEl: HTMLElement;
  private _loader: Loader = null;
  private _backgroundTile: GameTile = null;
  private _spriteSetTile: GameTile = null;

  private _gameCanvas: GameScene = null;
  private _scene: GameEngine = null;

  private _pillsCounter: PillsCounter = null;

  private _winPopup: ContinuePopup = null;
  private _failPopup: ContinuePopup = null;

  private _cleanupGlobalEventHandlers: () => void = () => {};

  constructor(container: HTMLElement) {
    this._containerEl = container;
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
    const bgImage = this._backgroundTile.getImage();
    this._gameCanvas = new GameScene(
      this._containerEl,
      {
        width: bgImage.naturalWidth,
        height: bgImage.naturalHeight,
      }
    );
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
      window.open('https://gitlab.com/jbyte777/prompt-ql', '_blank');
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
      this._cleanupGlobalEventHandlers();
      document.body.innerHTML = `
        <p class="h-text">G3XT3QPDN3BX4DKV4XCHVR5335R2SR1C2</p>
        <p class="h-text">https://gitlab.com/jbyte777/prompt-ql/-/tree/release-6.x</p>
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
    this._pillsCounter.changeCountBy(cnt);
  }

  private _onCanvasClick(e: MouseEvent) {
    const canvas = this._gameCanvas.getCanvas();
    const { top, left } = canvas.getBoundingClientRect();

    this._scene.fireEvent({
      name: GAME_SCENEMOUSECLICK_EVENT_ID,
      payload: {
        x: e.clientX - left,
        y: e.clientY - top,
      },
    });
  }

  private _onKeydown(e: KeyboardEvent) {
    // @ts-ignore
    if (!PERMITTED_KEYS[e.key]) {
      return;
    }

    this._scene.fireEvent({
      name: GAME_KEYDOWN_EVENT_ID,
      payload: {
        key: e.key,
      },
    });
  }

  private _onKeyup(e: KeyboardEvent) {
    // @ts-ignore
    if (!PERMITTED_KEYS[e.key]) {
      return;
    }

    this._scene.fireEvent({
      name: GAME_KEYUP_EVENT_ID,
      payload: {
        key: e.key,
      },
    });
  }

  private _setupGlobalEvtHandlers() {
    const keydownHandler = (e: any) => {
      this._onKeydown(e);
    };
    const keyupHandler = (e: any) => {
      this._onKeyup(e);
    };

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);

    this._cleanupGlobalEventHandlers = () => {
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('keyup', keyupHandler);
    };
  }

  private async _setupScene() {
    const bgImage = this._backgroundTile.getImage();
    this._scene = generateScene(
      this._gameCanvas.getCanvas(),
      {
        image: bgImage,
        width: bgImage.naturalWidth,
        height: bgImage.naturalHeight,
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

    this._gameCanvas.setClickHandler(
      (e) => {
        this._onCanvasClick(e);
      },
    );
    this._setupGlobalEvtHandlers();

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
    
    this._loader?.updateText('Loading sprite set...');
    this._spriteSetTile = await this._loadTile(GameTileset);

    this._loader?.updateText('Setup GUI...');
    await this._setupGui();

    this._loader?.updateText('Setup game scene...');
    await this._setupScene();

    this._loader?.unmount();
    this._loader = null;
  }

  public unmount() {
    this._cleanupGlobalEventHandlers();

    if (this._loader) {
      this._loader.unmount();
      this._loader = null;
    }

    if (this._failPopup) {
      this._failPopup.unmount();
      this._failPopup = null;
    }
    
    if (this._winPopup) {
      this._winPopup.unmount();
      this._winPopup = null;
    }

    if (this._pillsCounter) {
      this._pillsCounter.unmount();
      this._pillsCounter = null;
    }

    if (this._scene) {
      this._scene.pause();
    }

    if (this._gameCanvas) {
      this._gameCanvas.unmount();
      this._gameCanvas = null;
    }

    if (this._spriteSetTile) {
      this._spriteSetTile.unmount();
      this._spriteSetTile = null;
    }

    if (this._backgroundTile) {
      this._backgroundTile.unmount();
      this._backgroundTile = null;
    }
  }
}
