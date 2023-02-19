import HourGlassIcon from '@assets/hoursglass.svg';
import './styles.css';

interface LoaderProps {
  initText: string;
}

export class Loader {
  private _containerEl: HTMLElement;
  private _loaderEl: HTMLElement;
  private _textEl: HTMLElement;
  private _text: string;

  constructor(container: HTMLElement, props: LoaderProps) {
    this._containerEl = container;
    this._loaderEl = null;
    this._textEl = null;
    this._text = props.initText;
  }

  public mount() {
    const loaderEl = document.createElement('div');
    loaderEl.className = 'game-loader';
    loaderEl.innerHTML = `
      <div class="game-loader__inner">
        <img class="game-loader__icon" src="${HourGlassIcon}" alt="hoursglass" />
        <div class="game-loader__text">
          ${this._text}
        </div>
      </div>
    `;

    const textEl = loaderEl.querySelector('.game-loader__text');
    this._loaderEl = loaderEl;
    this._textEl = textEl as HTMLElement;

    this._containerEl.appendChild(loaderEl);
  }

  public unmount() {
    this._loaderEl.remove();
  }

  public updateText(text: string) {
    this._text = text;
    this._textEl.textContent = this._text;
  }
}
