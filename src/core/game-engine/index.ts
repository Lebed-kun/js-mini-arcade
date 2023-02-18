import { GameObject } from '@core/game-object';
import { GameEvent, isMouseEvent } from '@core/game-event';
import { isXYInBounds } from '@core/utils';
import { Background } from '@core/background';

export class GameEngine {
  private _canvas: HTMLCanvasElement;
  private _background: Background;
  private _gameObjects: GameObject[];
  private _gameEvents: GameEvent[];
  private _waitResume: () => Promise<void>;
  private _resume: () => void;

  constructor(canvas: HTMLCanvasElement, objects: GameObject[]) {
    this._canvas = canvas;
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
    this._resume();
    this._resume = null;
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
    while (this._gameEvents.length) {
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

        const dInt = (obj1Phys.y0 + obj1Phys.h) >= obj2Phys.y0;
        const uInt = obj1Phys.y0 <= (obj2Phys.y0 + obj2Phys.h);
        const lInt = obj1Phys.x0 <= (obj2Phys.x0 + obj2Phys.w);
        const rInt = (obj1Phys.x0 + obj1Phys.w) >= obj2Phys.x0;

        if (dInt && lInt) {
          obj1.addCollision('down', obj2);
          obj1.addCollision('left', obj2);
          obj2.addCollision('up', obj1);
          obj2.addCollision('right', obj1);
        }

        if (dInt && rInt) {
          obj1.addCollision('down', obj2);
          obj1.addCollision('right', obj2);
          obj2.addCollision('up', obj1);
          obj2.addCollision('left', obj1);
        }

        if (uInt && lInt) {
          obj1.addCollision('up', obj2);
          obj1.addCollision('left', obj2);
          obj2.addCollision('down', obj1);
          obj2.addCollision('right', obj1);
        }

        if (uInt && rInt) {
          obj1.addCollision('up', obj2);
          obj1.addCollision('right', obj2);
          obj2.addCollision('down', obj1);
          obj2.addCollision('left', obj1);
        }
      }
    }
  }

  private _applyGravityForce(obj: GameObject) {
    if (obj.downCollision) {
      obj.physicalObject.vy = 0;
    } else {
      obj.physicalObject.vy += obj.physicalObject.gravity * 0.67;
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
        continue;
      }

      const physObj = obj.physicalObject;

      if (physObj.isStatic || physObj.isGhost) {
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

        obj.clearDownCollision();
        downColl.clearUpCollision();
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

        obj.clearUpCollision();
        upColl.clearDownCollision();
      }

      if (leftColl && !leftColl.destroyed) {
        const leftCollPhys = leftColl.physicalObject;
        const dX = (leftCollPhys.x0 + leftCollPhys.w) - physObj.x0;
        
        if (!leftCollPhys.isGhost) {
          if (leftCollPhys.isStatic) {
            physObj.x0 += dX;
          } else {
            physObj.x0 += dX / 2;
            leftCollPhys.y0 -= dX / 2;
          }
        }

        obj.clearLeftCollision();
        leftColl.clearRightCollision();
      }

      if (rightColl && !rightColl.destroyed) {
        const rightCollPhys = leftColl.physicalObject;
        const dX = (physObj.x0 + physObj.w) - rightCollPhys.x0;
        
        if (!rightCollPhys.isGhost) {
          if (rightCollPhys.isStatic) {
            physObj.x0 -= dX;
          } else {
            physObj.x0 -= dX / 2;
            rightCollPhys.y0 += dX / 2;
          }
        }

        obj.clearRightCollision();
        rightColl.clearLeftCollision();
      }
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

      const physObj = obj.physicalObject;
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
      this._gameObjects.length
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

    await this._waitResume();

    this._resolveEvents();
    for (const obj of this._gameObjects) {
      obj.onResolveEvents();
      obj.clearEvents();
    }

    await this._waitResume();

    this._detectCollisions();
    for (const obj of this._gameObjects) {
      obj.onDetectCollisions();
    }

    await this._waitResume();

    this._applyForces();
    for (const obj of this._gameObjects) {
      obj.onApplyForces();
    }

    await this._waitResume();

    this._resolveCollisions();
    for (const obj of this._gameObjects) {
      obj.onResolveCollisions();
    }

    await this._waitResume();

    this._render();
    for (const obj of this._gameObjects) {
      obj.onRender();
    }

    await this._waitResume();

    this._clearDestroyedObjs();
    for (const obj of this._gameObjects) {
      obj.afterUpdate();
    }

    await this._waitResume();

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
