import GameBackground from '@assets/game-background.png';
import './styles.css';

export class GameBackgroundTile {
  private _containerEl: HTMLElement;
  private _imageEl: HTMLElement;

  constructor(container: HTMLElement) {
    this._containerEl = container;
    this._imageEl = null;
  }

  public mount(onLoad: () => void) {
    const imgEl = document.createElement('img');
    imgEl.className = 'game-background-tile';
    imgEl.onload = onLoad;
    imgEl.src = GameBackground;

    this._imageEl = imgEl;
    this._containerEl.appendChild(imgEl);
  }

  public getImage(): HTMLImageElement {
    return this._imageEl as HTMLImageElement;
  }

  public unmount() {
    this._imageEl.remove();
  }
}
