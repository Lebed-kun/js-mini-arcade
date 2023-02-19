import PillsCounterIcon from '@assets/pills-counter-icon.png';
import './styles.css';

export class PillsCounter {
  private _containerEl: HTMLElement;
  private _counterEl: HTMLElement;
  private _textEl: HTMLElement;
  private _count: number;

  constructor(container: HTMLElement) {
    this._containerEl = container;
    this._count = 0;
  }

  public mount() {
    const counterEl = document.createElement('div');
    counterEl.className = 'game-pills-counter';
    counterEl.innerHTML = `
      <img class="game-pills-counter__img" src="${PillsCounterIcon}" alt="pill" />
      <div class="game-pills-counter__text">
        x ${this._count}
      </div>
    `;
    
    const textEl = counterEl.querySelector('.game-pills-counter__text');
    this._textEl = textEl as HTMLElement;
    this._counterEl = counterEl;
    this._containerEl.appendChild(textEl);
  }

  public unmount() {
    this._counterEl.remove();
  }

  public increaseCountBy(cnt: number) {
    this._count += cnt;
    this._textEl.textContent = `x ${this._count}`;
  }
}
