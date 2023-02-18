import { GameObject } from '@core/game-object';
import { Sprite } from '@core/sprite';
import { GAME_OBJ_ID_BOX } from '@game/consts';

export class Box extends GameObject {
  constructor(sprite: Sprite, x0: number, y0: number) {
    super(
      GAME_OBJ_ID_BOX,
      {
        x0,
        y0,
        w: 58,
        h: 58,
        vx: 0,
        vy: 0,
        isStatic: true,
        isGhost: false,
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