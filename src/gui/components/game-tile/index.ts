import './styles.css';

interface GameTileProps {
  imageSrc: string;
  onLoad: () => void;
}

export class GameTile {
  private _containerEl: HTMLElement;
  private _imageEl: HTMLElement;
  private _imageSrc: string;
  private _onLoad: () => void;

  constructor(container: HTMLElement, props: GameTileProps) {
    this._containerEl = container;
    this._imageEl = null;
    this._imageSrc = props.imageSrc;
    this._onLoad = props.onLoad;
  }

  public mount() {
    const imgEl = document.createElement('img');
    imgEl.className = 'game-tile';
    imgEl.onload = () => this._onLoad();
    imgEl.src = this._imageSrc;

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
