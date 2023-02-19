import './styles.css';

interface GameSceneProps {
  onClick?: (e?: MouseEvent) => void;
}

export class GameScene {
  private _containerEl: HTMLElement;
  private _canvasEl: HTMLCanvasElement;
  private _onClick?: (e?: MouseEvent) => void;
  
  constructor(container: HTMLElement, props?: GameSceneProps) {
    this._containerEl = container;
    this._onClick = props?.onClick;
  }

  public mount() {
    const canvas = document.createElement('canvas');
    canvas.className = 'game-scene';
    if (this._onClick) {
      canvas.addEventListener('click', (e) => this._onClick(e));
    }

    this._canvasEl = canvas;
    this._containerEl.appendChild(canvas);
  }

  public getCanvas(): HTMLCanvasElement {
    return this._canvasEl;
  }

  public unmount() {
    this._canvasEl.remove();
  }
}
