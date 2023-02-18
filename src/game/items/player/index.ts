import { GameObject } from '@core/game-object';
import { Sprite } from '@core/sprite';
import { GRAVITY, GAME_OBJ_ID_PLAYER, GAME_OBJ_ID_PILL, GAME_OBJ_ID_ENEMY, GAME_OBJ_ID_DOOR } from '@game/consts';
import * as events from '@core/game-event';

const JUMP_VELOCITY = 60.11;
const MOVE_VELOCITY = 20.33;

interface PlayerState {
  pillsCollected: number;
  move: boolean;
  moveDir: 'l' | 'r';
  attackCastedDir: 'l' | 'r' | null;
  jump: boolean;
  damaged: boolean;
}

export interface PlayerSprites {
  moveLeft: Sprite;
  moveRight: Sprite;
  attackLeft: Sprite;
  attackRight: Sprite;
}

export interface PlayerOptions {
  requiredPills: number;
  onPillCollect: (count: number) => void;
  onDoorHit: () => void;
  onDie: () => void;
}

export class Player extends GameObject {
  private readonly _sprites: PlayerSprites;
  private readonly _options: PlayerOptions;
  private _state: PlayerState;

  constructor(
    sprites: PlayerSprites,
    x0: number,
    y0: number,
    options: PlayerOptions,
  ) {
    super(
      GAME_OBJ_ID_PLAYER,
      {
        x0,
        y0,
        w: 80,
        h: 106,
        vx: 0,
        vy: 0,
        isStatic: false,
        isGhost: false,
        gravity: GRAVITY,
      },
      sprites.moveLeft,
    );
    this._sprites = sprites;
    this._options = options;
    this._state = {
      pillsCollected: 0,
      move: false,
      moveDir: 'l',
      attackCastedDir: null,
      jump: false,
      damaged: false,
    };
  }

  public beforeUpdate(): void {}
  
  public onResolveEvents(): void {
    for (const evt of this._eventsQueue) {
      if (evt.name === events.GAME_KEYDOWN_EVENT_ID) {
        switch (evt.payload.key) {
          case 'w':
          case 'ArrowDown':
            this._state.jump = true;
            break;
          case 'a':
          case 'ArrowLeft':
            this._state.move = true;
            this._state.moveDir = 'l';
            break;
          case 'd':
          case 'ArrowRight':
            this._state.move = true;
            this._state.moveDir = 'r';
            break;
        }

        continue;
      }

      if (evt.name === events.GAME_KEYUP_EVENT_ID) {
        switch (evt.payload.key) {
          case 'a':
          case 'ArrowLeft':
          case 'd':
          case 'ArrowRight':
            this._state.move = false;
            break;
        }
        
        continue;
      }

      if (evt.name === events.GAME_SCENEMOUSECLICK_EVENT_ID) {
        const { y: cY } = evt.payload;
        const { y0, h } = this._physicalObj;

        if (cY >= y0 && cY <= (y0 + h)) {
          this._state.attackCastedDir = this._state.moveDir;
        }
        
        continue;
      }
    }
  }

  private _handleDamage(): void {
    if (this._state.pillsCollected > 0) {
      this._state.pillsCollected = 0;
    } else {
      this._destroyed = true;
    }

    this._state.damaged = true;
  }

  private _handleEnemyCollision(enemy: GameObject): void {
    if (!this._state.attackCastedDir) {
      this._handleDamage();
      return;
    }

    const { attackCastedDir } = this._state;
    const { x0: playerX, w: playerW } = this._physicalObj;
    const { x0: enemyX, w: enemyW } = enemy.physicalObject;

    if (attackCastedDir === 'l' && playerX <= (enemyX + enemyW)) {
      enemy.destroy();
      this._state.pillsCollected += 10;
      this._options.onPillCollect(10);
      return;
    }

    if (attackCastedDir === 'r' && (playerX + playerW) >= enemyX) {
      enemy.destroy();
      this._state.pillsCollected += 10;
      this._options.onPillCollect(10);
      return;
    }

    this._handleDamage();
  }

  private _handleEnemyCollisions(): void {
    const upColl = this._upCollidedObject;
    if (upColl?.protoId === GAME_OBJ_ID_ENEMY) {
      this._handleEnemyCollision(upColl);
      if (this._state.damaged) {
        return;
      }
    }

    const downColl = this._downCollidedObject;
    if (downColl?.protoId === GAME_OBJ_ID_ENEMY) {
      this._handleEnemyCollision(downColl);
      if (this._state.damaged) {
        return;
      }
    }

    const leftColl = this._leftCollidedObject;
    if (leftColl?.protoId === GAME_OBJ_ID_ENEMY) {
      this._handleEnemyCollision(leftColl);
      if (this._state.damaged) {
        return;
      }
    }

    const rightColl = this._rightCollidedObject;
    if (rightColl?.protoId === GAME_OBJ_ID_ENEMY) {
      this._handleEnemyCollision(rightColl);
      if (this._state.damaged) {
        return;
      }
    }
  }

  private _handlePillCollision(_pill: GameObject): void {
    this._state.pillsCollected++;
    this._options.onPillCollect(1);
  }

  private _handlePillCollisions(): void {
    const upColl = this._upCollidedObject;
    if (upColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(upColl);
    }

    const downColl = this._downCollidedObject;
    if (downColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(downColl);
    }

    const leftColl = this._leftCollidedObject;
    if (leftColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(leftColl);
    }

    const rightColl = this._rightCollidedObject;
    if (rightColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(rightColl);
    }
  }

  private _handleDoorCollision(_door: GameObject): void {
    if (this._state.pillsCollected === this._options.requiredPills) {
      this._options.onDoorHit();
    }
  }

  private _handleDoorCollisions(): void {
    const upColl = this._upCollidedObject;
    if (upColl?.protoId === GAME_OBJ_ID_DOOR) {
      this._handleDoorCollision(upColl);
    }

    const downColl = this._downCollidedObject;
    if (downColl?.protoId === GAME_OBJ_ID_DOOR) {
      this._handleDoorCollision(downColl);
    }

    const leftColl = this._leftCollidedObject;
    if (leftColl?.protoId === GAME_OBJ_ID_DOOR) {
      this._handleDoorCollision(leftColl);
    }

    const rightColl = this._rightCollidedObject;
    if (rightColl?.protoId === GAME_OBJ_ID_DOOR) {
      this._handleDoorCollision(rightColl);
    }
  }

  public onDetectCollisions(): void {
    this._handleEnemyCollisions();
    if (this._destroyed) {
      return;
    }
    this._state.damaged = false;

    this._handlePillCollisions();
    this._handleDoorCollisions();
  }

  private _handleJump(): void {
    if (this._state.jump) {
      this._physicalObj.vy = -JUMP_VELOCITY;
      this._physicalObj.y0 += this._physicalObj.vy;
    }
  }

  private _handleMove(): void {
    if (this._state.move) {
      if (this._state.moveDir === 'l') {
        this._physicalObj.vx = -MOVE_VELOCITY;
      } else {
        this._physicalObj.vx = MOVE_VELOCITY;
      }
    } else {
      this._physicalObj.vx = 0;
    }

    this._physicalObj.x0 += this._physicalObj.vx;
  }

  public onApplyForces(): void {
    if (this._destroyed) {
      return;
    }

    this._handleJump();
    this._handleMove();
  }

  private _prepareSprite(): void {
    if (this._state.attackCastedDir === 'l') {
      this._sprite = this._sprites.attackLeft;
      return;
    }

    if (this._state.attackCastedDir === 'r') {
      this._sprite = this._sprites.attackRight;
      return;
    }

    if (this._state.moveDir === 'l') {
      this._sprite = this._sprites.moveLeft;
      return;
    }

    if (this._state.moveDir === 'r') {
      this._sprite = this._sprites.moveRight;
      return;
    }
  }
  
  public onResolveCollisions(): void {
    if (this._destroyed) {
      this._options.onDie();
      return;
    }

    this._prepareSprite();
  }
  
  public onRender(): void {}

  public afterUpdate(): void {
    this._state.attackCastedDir = null;
    this._state.jump = false;
  }
}