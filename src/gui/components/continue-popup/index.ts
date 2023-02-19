import ChibiIcon from '@assets/chibi.gif';
import './styles.css';

interface ContinuePopupProps {
  initText: string;
  onContinue: () => void;
}

export class ContinuePopup {
  private _containerEl: HTMLElement;
  private _loaderEl: HTMLElement;
  private _textEl: HTMLElement;
  private _text: string;
  private _onContinue: () => void;

  constructor(container: HTMLElement, props: ContinuePopupProps) {
    this._containerEl = container;
    this._loaderEl = null;
    this._textEl = null;
    this._text = props.initText;
    this._onContinue = props.onContinue;
  }

  public mount() {
    const loaderEl = document.createElement('div');
    loaderEl.className = 'game-continue-popup';
    loaderEl.innerHTML = `
      <div class="game-continue-popup__inner">
        <img class="game-continue-popup__icon" src="${ChibiIcon}" alt="chibi" />
        <div class="game-continue-popup__text">
          ${this._text}
        </div>
        <button class="game-continue-popup__button">
          OK!
        </button>
      </div>
    `;

    const textEl = loaderEl.querySelector('.game-continue-popup__text');
    this._loaderEl = loaderEl;
    this._textEl = textEl as HTMLElement;

    const buttonEl = loaderEl.querySelector('.game-continue-popup__button');
    buttonEl.addEventListener('click', this._onContinue);

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
