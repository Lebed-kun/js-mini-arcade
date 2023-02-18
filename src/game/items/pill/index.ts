import { GameObject } from '@core/game-object';
import { Sprite } from '@core/sprite';
import { GAME_OBJ_ID_PILL } from '@game/consts';

export class Pill extends GameObject {
  constructor(sprite: Sprite, x0: number, y0: number) {
    super(
      GAME_OBJ_ID_PILL,
      {
        x0,
        y0,
        w: 54,
        h: 54,
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
  public onApplyForces(): void {}
  public onDetectCollisions(): void {}
  public onResolveCollisions(): void {}
  public onRender(): void {}
  public afterUpdate(): void {}
}