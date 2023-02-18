import { GameObject } from '@core/game-object';
import { Sprite } from '@core/sprite';
import { GAME_OBJ_ID_DOOR } from '@game/consts';

export class Door extends GameObject {
  constructor(sprite: Sprite, x0: number, y0: number) {
    super(
      GAME_OBJ_ID_DOOR,
      {
        x0,
        y0,
        w: 64,
        h: 70,
        vx: 0,
        vy: 0,
        isStatic: true,
        isGhost: true,
        gravity: 0,
      },
      sprite,
    );
  }
  
  public beforeUpdate(): void {}
  public onResolveEvents(): void {}
  public onDetectCollisions(): void {}
  public onApplyForces(): void {}
  public onResolveCollisions(): void {}
  public onRender(): void {}
  public afterUpdate(): void {}
}