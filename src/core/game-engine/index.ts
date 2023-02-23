import { GameObject } from '@core/game-object';
import { GameEvent, isMouseEvent } from '@core/game-event';
import { isXYInBounds } from '@core/utils';
import { Background } from '@core/background';
import { COLLISION_MIN_BOUND } from '@core/consts';
import { GAME_OBJ_ID_PLAYER } from '@/game/consts';

export class GameEngine {
  private _canvas: HTMLCanvasElement;
  private _background: Background;
  private _gameObjects: GameObject[];
  private _gameEvents: GameEvent[];
  private _waitResume: () => Promise<void>;
  private _resume: () => void;

  constructor(canvas: HTMLCanvasElement, background: Background, objects: GameObject[]) {
    this._canvas = canvas;
    this._background = background;
    this._gameObjects = objects;
    this._gameEvents = new Array(objects.length * 64);

    this._waitResume = () => {
      return new Promise(
        (res) => {
          this._resume = res;
        },
      );
    };
  }

  public fireEvent(evt: GameEvent) {
    this._gameEvents.push(evt);
  }

  public pause() {
    this._waitResume = () => {
      return new Promise(
        (res) => {
          this._resume = res;
        },
      );
    };
  }

  private _resumeImpl() {
    if (this._resume) {
      this._resume();
      this._resume = null;
    }

    this._waitResume = () => {
      return new Promise(
        (res) => {
          res();
        },
      );
    };
  }
  public resume() {
    this._resumeImpl();
  }

  private _resolveEvents() {
    // @ts-ignore
    while (this._gameEvents[this._gameEvents.length - 1]) {
      const evt = this._gameEvents.pop();
      for (const obj of this._gameObjects) {
        if (obj.destroyed) {
          continue;
        }

        if (isMouseEvent(evt)) {
          const physObj = obj.physicalObject;

          if (isXYInBounds(
            // @ts-ignore
            evt.payload.x,
            // @ts-ignore
            evt.payload.y,
            physObj.x0,
            physObj.y0,
            physObj.w,
            physObj.h,
          )) {
            obj.fireEvent(evt);
          }
        } else {
          obj.fireEvent(evt);
        }
      }
    }
  }

  private _detectCollisions() {
    for (let i = 0; i < this._gameObjects.length; i++) {
      const obj1 = this._gameObjects[i];
      if (obj1.destroyed) {
        continue;
      }

      const obj1Phys = obj1.physicalObject;
      for (let j = i + 1; j < this._gameObjects.length; j++) {
        const obj2 = this._gameObjects[j];
        if (obj2.destroyed) {
          continue;
        }

        const obj2Phys = obj2.physicalObject;

        let dInt = (obj1Phys.y0 + obj1Phys.h) - obj2Phys.y0;
        let uInt = (obj2Phys.y0 + obj2Phys.h) - obj1Phys.y0;
        let lInt = (obj2Phys.x0 + obj2Phys.w) - obj1Phys.x0;
        let rInt = (obj1Phys.x0 + obj1Phys.w) - obj2Phys.x0;

        const hasCollision = dInt > COLLISION_MIN_BOUND &&
          uInt > COLLISION_MIN_BOUND &&
          lInt > COLLISION_MIN_BOUND &&
          rInt > COLLISION_MIN_BOUND;

        if (hasCollision && dInt > COLLISION_MIN_BOUND && (dInt < lInt || dInt < rInt)) {
          obj1.addCollision('down', obj2);
          obj2.addCollision('up', obj1);
          lInt = -1.0;
          rInt = -1.0;
        }

        if (hasCollision && uInt > COLLISION_MIN_BOUND && (uInt < lInt || uInt < rInt)) {
          obj1.addCollision('up', obj2);
          obj2.addCollision('down', obj1);
          lInt = -1.0;
          rInt = -1.0;
        }

        if (hasCollision && rInt > COLLISION_MIN_BOUND && (rInt < uInt || rInt < dInt)) {
          obj1.addCollision('right', obj2);
          obj2.addCollision('left', obj1);
          uInt = -1.0;
          dInt = -1.0;
        }

        if (hasCollision && lInt > COLLISION_MIN_BOUND && (lInt < uInt || lInt < dInt)) {
          obj1.addCollision('left', obj2);
          obj2.addCollision('right', obj1);
          uInt = -1.0;
          dInt = -1.0;
        }
      }
    }
  }

  private _applyGravityForce(obj: GameObject) {
    if (obj.downCollision) {
      obj.physicalObject.vy = 0;
    } else {
      obj.physicalObject.vy += obj.physicalObject.gravity;
    }

    obj.physicalObject.y0 += obj.physicalObject.vy;
  }

  private _applyForces() {
    for (const obj of this._gameObjects) {
      if (obj.destroyed || obj.physicalObject.isStatic) {
        continue;
      }

      this._applyGravityForce(obj);
    }
  }

  private _resolveCollisions() {
    for (const obj of this._gameObjects) {
      if (obj.destroyed) {
        obj.clearDownCollision();
        obj.clearUpCollision();
        obj.clearLeftCollision();
        obj.clearRightCollision();
        continue;
      }

      const physObj = obj.physicalObject;

      if (physObj.isStatic || physObj.isGhost) {
        obj.clearDownCollision();
        obj.clearUpCollision();
        obj.clearLeftCollision();
        obj.clearRightCollision();
        continue;
      }

      const downColl = obj.downCollision;
      const upColl = obj.upCollision;
      const leftColl = obj.leftCollision;
      const rightColl = obj.rightCollision;

      if (downColl && !downColl.destroyed) {
        const downCollPhys = downColl.physicalObject;
        const dY = (physObj.y0 + physObj.h) - downCollPhys.y0;
        
        if (!downCollPhys.isGhost) {
          if (downCollPhys.isStatic) {
            physObj.y0 -= dY;
          } else {
            physObj.y0 -= dY / 2;
            downCollPhys.y0 += dY / 2;
          }
        }
      }
      
      if (upColl && !upColl.destroyed) {
        const upCollPhys = upColl.physicalObject;
        const dY = (upCollPhys.y0 + upCollPhys.h) - physObj.y0;
        
        if (!upCollPhys.isGhost) {
          if (upCollPhys.isStatic) {
            physObj.y0 += dY;
          } else {
            physObj.y0 += dY / 2;
            upCollPhys.y0 -= dY / 2;
          }
        }
      }

      if (leftColl && !leftColl.destroyed) {
        const leftCollPhys = leftColl.physicalObject;
        const dX = (leftCollPhys.x0 + leftCollPhys.w) - physObj.x0;
        
        if (!leftCollPhys.isGhost) {
          if (leftCollPhys.isStatic) {
            physObj.x0 += dX;
          } else {
            physObj.x0 += dX / 2;
            leftCollPhys.x0 -= dX / 2;
          }
        }
      }

      if (rightColl && !rightColl.destroyed) {
        const rightCollPhys = rightColl.physicalObject;
        const dX = (physObj.x0 + physObj.w) - rightCollPhys.x0;
        
        if (!rightCollPhys.isGhost) {
          if (rightCollPhys.isStatic) {
            physObj.x0 -= dX;
          } else {
            physObj.x0 -= dX / 2;
            rightCollPhys.x0 += dX / 2;
          }
        }
      }

      obj.clearDownCollision();
      downColl?.clearUpCollision();
      obj.clearUpCollision();
      upColl?.clearDownCollision();
      obj.clearLeftCollision();
      leftColl?.clearRightCollision();
      obj.clearRightCollision();
      rightColl?.clearLeftCollision();
    }
  }

  private _render() {
    const canvasCtx = this._canvas.getContext('2d');
    canvasCtx.drawImage(
      this._background.image,
      0,
      0,
      this._background.width,
      this._background.height,
    );

    for (const obj of this._gameObjects) {
      if (obj.destroyed) {
        continue;
      }

      const sprite = obj.sprite;

      canvasCtx.drawImage(
        sprite.tileset,
        sprite.srcX,
        sprite.srcY,
        sprite.srcWidth,
        sprite.srcHeight,
        obj.physicalObject.x0,
        obj.physicalObject.y0,
        obj.physicalObject.w,
        obj.physicalObject.h,
      );
    }
  }

  private _clearDestroyedObjs() {
    for (let l = 0, r = 0; r < this._gameObjects.length; r++) {
      if (!this._gameObjects[r].destroyed) {
        const temp = this._gameObjects[r];
        this._gameObjects[r] = this._gameObjects[l];
        this._gameObjects[l] = temp;
        l++;
      }
    }

    while (
      this._gameObjects[this._gameObjects.length - 1]
      && this._gameObjects[this._gameObjects.length - 1].destroyed
    ) {
      this._gameObjects.pop();
    }
  }

  private async _runIteration() {
    await this._waitResume();

    for (const obj of this._gameObjects) {
      obj.beforeUpdate();
    }

    this._resolveEvents();
    for (const obj of this._gameObjects) {
      obj.onResolveEvents();
      obj.clearEvents();
    }

    this._detectCollisions();
    for (const obj of this._gameObjects) {
      obj.onDetectCollisions();
    }

    this._applyForces();
    for (const obj of this._gameObjects) {
      obj.onApplyForces();
    }

    this._resolveCollisions();
    for (const obj of this._gameObjects) {
      obj.onResolveCollisions();
    }

    this._render();
    for (const obj of this._gameObjects) {
      obj.onRender();
    }

    this._clearDestroyedObjs();
    for (const obj of this._gameObjects) {
      obj.afterUpdate();
    }

  window.requestAnimationFrame(
    async () => {
      await this._runIteration();
    },
  );
  }

  public start() {
    this._resumeImpl();
    window.requestAnimationFrame(
      async () => {
        await this._runIteration();
      },
    );
  }
}
