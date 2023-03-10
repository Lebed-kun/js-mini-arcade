import { GameObject } from '@core/game-object';
import { Sprite } from '@core/sprite';
import { GRAVITY, GAME_OBJ_ID_ENEMY } from '@game/consts';

const RESTORE_JUMP_VELOCITY = 1.2;
const MOVE_VELOCITY = 1.67;
const TWEAK_DEADLINE_MS = 500;

interface EnemyState {
  direction: number;
  tweaked: boolean; 
  tweakedAt: number;
}

export interface EnemySprites {
  move1Left: Sprite;
  move2Left: Sprite;
  move1Right: Sprite;
  move2Right: Sprite;
}

export class Enemy extends GameObject {
  private readonly _sprites: EnemySprites;
  private _state: EnemyState;

  constructor(
    sprites: EnemySprites,
    x0: number,
    y0: number,
  ) {
    super(
      GAME_OBJ_ID_ENEMY,
      {
        x0,
        y0,
        w: 82,
        h: 108,
        vx: MOVE_VELOCITY,
        vy: 0,
        isStatic: false,
        isGhost: false,
        gravity: GRAVITY,
      },
      sprites.move1Right,
    );
    this._sprites = sprites;
    this._state = {
      direction: 1,
      tweaked: false,
      tweakedAt: -1,
    };
  }
  
  public beforeUpdate(): void {}
  public onResolveEvents(): void {}
  public onDetectCollisions(): void {}
  
  public onApplyForces(): void {
    if (this._destroyed) {
      return;
    }

    const canvas = this._boundedScene.canvas;
    const { x0, w } = this._physicalObj;
    if (x0 < 0 && this._state.direction === -1) {
      this._state.direction = -this._state.direction;
    }
    if (x0 > (canvas.width - w) && this._state.direction === 1) {
      this._state.direction = -this._state.direction;
    }

    if (this._physicalObj.vy > 0.5) {
      this._physicalObj.vy = -RESTORE_JUMP_VELOCITY;
      this._physicalObj.y0 += this._physicalObj.vy;
      this._state.direction = -this._state.direction;
    }

    this._physicalObj.x0 += this._physicalObj.vx * this._state.direction;
  }

  public onResolveCollisions(): void {}

  public onRender(): void {
    if (this._destroyed) {
      return;
    }

    const now = Date.now();
    const tweakedAt = this._state.tweakedAt;
    if (tweakedAt < 0 || (now - tweakedAt) > TWEAK_DEADLINE_MS) {
      this._state.tweaked = !this._state.tweaked;
      this._state.tweakedAt = Date.now();
    }

    if (this._state.direction === -1) {
      if (this._state.tweaked) {
        this._sprite = this._sprites.move2Left;
      } else {
        this._sprite = this._sprites.move1Left;
      }
    } else {
      if (this._state.tweaked) {
        this._sprite = this._sprites.move2Right;
      } else {
        this._sprite = this._sprites.move1Right;
      }
    }
  }
  
  public afterUpdate(): void {}
}
