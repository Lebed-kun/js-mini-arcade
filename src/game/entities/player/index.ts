import { GameObject } from '@core/game-object';
import { Sprite } from '@core/sprite';
import { GRAVITY, GAME_OBJ_ID_PLAYER, GAME_OBJ_ID_PILL, GAME_OBJ_ID_ENEMY, GAME_OBJ_ID_DOOR } from '@game/consts';
import * as events from '@core/game-event';

const JUMP_VELOCITY = 25.01;
const MOVE_VELOCITY = 5.33;
const ATTACK_STATE_DEADLINE_MS = 500;
const DAMAGE_DEADLINE_MS = 1000;

interface PlayerState {
  pillsCollected: number;
  move: boolean;
  moveDir: 'l' | 'r';
  attackCastedDir: 'l' | 'r' | null;
  attackCastedAtMs: number;
  jump: boolean;
  damaged: boolean;
  damagedAt: number;
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
      attackCastedAtMs: -1,
      jump: false,
      damaged: false,
      damagedAt: -1,
    };

    this.subscribeEvent(events.GAME_KEYDOWN_EVENT_ID);
    this.subscribeEvent(events.GAME_KEYUP_EVENT_ID);
    this.subscribeEvent(events.GAME_SCENEMOUSECLICK_EVENT_ID);
  }

  public beforeUpdate(): void {}

  public onResolveEvents(): void {
    for (let i = 0; !!this._eventsQueue[i]; i++) {
      const evt = this._eventsQueue[i];

      if (evt.name === events.GAME_KEYDOWN_EVENT_ID) {
        switch (evt.payload.key) {
          case 'w':
          case 'W':
          case 'ArrowUp':
            this._state.jump = true;
            break;
          case 'a':
          case 'A':
          case 'ArrowLeft':
            this._state.move = true;
            this._state.moveDir = 'l';
            break;
          case 'd':
          case 'D':
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
          case 'A':
          case 'ArrowLeft':
          case 'd':
          case 'D':
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
          this._state.attackCastedAtMs = Date.now();
        }
        
        continue;
      }
    }
  }

  private _handleDamage(): void {
    const now = Date.now();
    const damagedAt = this._state.damagedAt;
    if (damagedAt >= 0 && (now - damagedAt) < DAMAGE_DEADLINE_MS) {
      return;
    }

    if (this._state.pillsCollected > 0) {
      const prevPills = this._state.pillsCollected;
      this._state.pillsCollected = 0;
      this._options.onPillCollect(-prevPills);
    } else {
      this._destroyed = true;
    }

    this._state.damaged = true;
    this._state.damagedAt = Date.now();
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
      upColl.destroy();
    }

    const downColl = this._downCollidedObject;
    if (downColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(downColl);
      downColl.destroy();
    }

    const leftColl = this._leftCollidedObject;
    if (leftColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(leftColl);
      leftColl.destroy();
    }

    const rightColl = this._rightCollidedObject;
    if (rightColl?.protoId === GAME_OBJ_ID_PILL) {
      this._handlePillCollision(rightColl);
      rightColl.destroy();
    }
  }

  private _handleDoorCollision(_door: GameObject): void {
    if (this._state.pillsCollected >= this._options.requiredPills) {
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

  private _checkJumpingCollision(): void {
    if (!this._downCollidedObject) {
      this._state.jump = false;
    }
  }

  public onDetectCollisions(): void {
    this._checkJumpingCollision();

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
    const canvas = this._boundedScene.canvas;
    const { x0, w } = this._physicalObj;
    if (x0 < 0 && this._state.moveDir === 'l') {
      return;
    }
    if (x0 > (canvas.width - w) && this._state.moveDir === 'r') {
      return;
    }

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
    } else if (this._state.attackCastedDir === 'r') {
      this._sprite = this._sprites.attackRight;
    } else if (this._state.moveDir === 'l') {
      this._sprite = this._sprites.moveLeft;
    } else if (this._state.moveDir === 'r') {
      this._sprite = this._sprites.moveRight;
    }

    this._physicalObj.w = this._sprite.srcWidth;
    this._physicalObj.h = this._sprite.srcHeight;
  }
  
  public onResolveCollisions(): void {
    if (this._destroyed) {
      this._options.onDie();
      return;
    }

    this._prepareSprite();
  }
  
  public onRender(): void {
    if (this._destroyed) {
      this.unsubscribeEvent(events.GAME_KEYDOWN_EVENT_ID);
      this.unsubscribeEvent(events.GAME_KEYUP_EVENT_ID);
      this.unsubscribeEvent(events.GAME_SCENEMOUSECLICK_EVENT_ID);
    }
  }

  public afterUpdate(): void {
    const now = Date.now();
    const attackCastedAt = this._state.attackCastedAtMs;
    if (attackCastedAt >= 0 && (now - attackCastedAt) > ATTACK_STATE_DEADLINE_MS) {
      this._state.attackCastedDir = null;
      this._state.attackCastedAtMs = -1;
    }

    this._state.jump = false;
  }
}