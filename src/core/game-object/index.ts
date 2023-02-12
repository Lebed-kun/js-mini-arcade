import { BehavObject } from '@core/behav-object';
import { PhysicalObject } from '@core/physical-object';
import { Sprite } from '@core/sprite';
import { GameEvent, GameEventsSubscriptions } from '@core/game-event';

export abstract class GameObject {
  protected _behavObj: BehavObject;
  protected _physicalObj: PhysicalObject;
  protected _sprite: Sprite;

  protected _eventsQueue: GameEvent[];
  protected _eventsSubscriptions: GameEventsSubscriptions;
  protected _upCollidedObject: GameObject;
  protected _downCollidedObject: GameObject;
  protected _leftCollidedObject: GameObject;
  protected _rightCollidedObject: GameObject;
  protected _destroyed: boolean;

  constructor(
    behavObj: BehavObject,
    physicalObj: PhysicalObject,
    sprite: Sprite,
  ) {
    this._behavObj = behavObj;
    this._physicalObj = physicalObj;
    this._sprite = sprite;

    this._eventsQueue = new Array(64);
    this._eventsSubscriptions = {};
    this._upCollidedObject = null;
    this._downCollidedObject = null;
    this._leftCollidedObject = null;
    this._rightCollidedObject = null;

    this._destroyed = false;
  }

  public get behavObject(): BehavObject {
    return this._behavObj;
  }
  public get physicalObject(): PhysicalObject {
    return this._physicalObj;
  }
  public get sprite(): Sprite {
    return this._sprite;
  }

  public fireEvent(evt: GameEvent) {
    if (this._eventsSubscriptions[evt.name]) {
      this._eventsQueue.push(evt);
    }
  }
  public subscribeEvent(evtName: string) {
    this._eventsSubscriptions[evtName] = true;
  }
  public unsubscribeEvent(evtName: string) {
    delete this._eventsSubscriptions[evtName];
  }
  public clearEvents() {
    while (this._eventsQueue.length) {
      this._eventsQueue.pop();
    }
  }

  public addCollision(kind: 'up' | 'down' | 'left' | 'right', obj: GameObject) {
    switch (kind) {
      case 'down':
        this._downCollidedObject = obj;
        break;
      case 'up':
        this._upCollidedObject = obj;
        break;
      case 'left':
        this._leftCollidedObject = obj;
        break;
      case 'right':
        this._rightCollidedObject = obj;
        break;
    }
  }
  public clearUpCollision() {
    this._upCollidedObject = null;
  }
  public clearDownCollision() {
    this._downCollidedObject = null;
  }
  public clearLeftCollision() {
    this._leftCollidedObject = null;
  }
  public clearRightCollision() {
    this._rightCollidedObject = null;
  }
  public get upCollision() {
    return this._upCollidedObject;
  }
  public get downCollision() {
    return this._downCollidedObject;
  }
  public get leftCollision() {
    return this._leftCollidedObject;
  }
  public get rightCollision() {
    return this._rightCollidedObject;
  }

  public get destroyed(): boolean {
    return this._destroyed;
  }
  public destroy(): void {
    this._destroyed = true;
  }

  public abstract beforeUpdate(): void;
  public abstract onResolveEvents(): void;
  public abstract onApplyForces(): void;
  public abstract onDetectCollisions(): void;
  public abstract onResolveCollisions(): void;
  public abstract onRender(): void;
  public abstract afterUpdate(): void;
}
