import './styles.css';

interface GameSceneProps {
  width: number;
  height: number;
  onClick?: (e?: MouseEvent) => void;
}

export class GameScene {
  private _containerEl: HTMLElement;
  private _canvasEl: HTMLCanvasElement;
  private _width: number;
  private _height: number;
  private _onClick?: (e?: MouseEvent) => void;
  
  constructor(container: HTMLElement, props?: GameSceneProps) {
    this._containerEl = container;
    this._onClick = props?.onClick;
    this._width = props?.width;
    this._height = props?.height;
  }

  public mount() {
    const canvas = document.createElement('canvas');
    canvas.className = 'game-scene';
    canvas.width = this._width;
    canvas.height = this._height;
    if (this._onClick) {
      canvas.addEventListener('click', this._onClick);
    }

    this._canvasEl = canvas;
    this._containerEl.appendChild(canvas);
  }

  public getCanvas(): HTMLCanvasElement {
    return this._canvasEl;
  }

  public setClickHandler(onClick: (e?: MouseEvent) => void): void {
    if (this._onClick) {
      this._canvasEl.removeEventListener('click', this._onClick);
    }

    this._onClick = onClick;
    this._canvasEl.addEventListener('click', this._onClick);
  }

  public unmount() {
    if (this._canvasEl) {
      this._canvasEl.remove();
      this._canvasEl = null;
    }
  }
}
