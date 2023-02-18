import HourGlassIcon from '@assets/hoursglass.svg';
import './styles.css';

export class Loader {
  private _containerEl: HTMLElement;
  private _loaderEl: HTMLElement;
  private _textEl: HTMLElement;

  constructor(container: HTMLElement) {
    this._containerEl = container;
    this._loaderEl = null;
    this._textEl = null;
  }

  public mount(text: string) {
    const loaderEl = document.createElement('div');
    loaderEl.className = 'game-loader';
    loaderEl.innerHTML = `
      <img class="game-loader__icon" src="${HourGlassIcon}" alt="hoursglass" />
      <div class="game-loader__text">
        ${text}
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
    this._textEl.textContent = text;
  }
}
