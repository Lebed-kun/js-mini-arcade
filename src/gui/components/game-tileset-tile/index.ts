import GameTileset from '@assets/tileset.png';
import './styles.css';

export class GameTilesetTile {
  private _containerEl: HTMLElement;
  private _imageEl: HTMLElement;

  constructor(container: HTMLElement) {
    this._containerEl = container;
    this._imageEl = null;
  }

  public mount(onLoad: () => void) {
    const imgEl = document.createElement('img');
    imgEl.className = 'game-tileset-tile';
    imgEl.onload = onLoad;
    imgEl.src = GameTileset;

    this._imageEl = imgEl;
    this._containerEl.appendChild(imgEl);
  }

  public getImage(): HTMLImageElement {
    return this._imageEl as HTMLImageElement;
  }
}
