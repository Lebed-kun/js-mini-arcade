import { Sprite } from '@core/sprite';
import { Box } from '@game/entities/box';
import { Pill } from '@game/entities/pill';
import { Enemy, EnemySprites } from '@game/entities/enemy';
import { Player, PlayerSprites, PlayerOptions } from '@game/entities/player';
import { Door } from '@game/entities/door';
import { GameEngine } from '@core/game-engine';
import { Background } from '@core/background';

const generateWalls = (tileset: HTMLImageElement): Box[] => {
  const sprite: Sprite = {
    tileset,
    srcX: 8,
    srcY: 140,
    srcWidth: 58,
    srcHeight: 58,
  };

  const res: Box[] = [];

  let x = 0.0;
  let y = 282.0;
  for (let i = 0; i < 12; i++) {
    res.push(
      new Box(
        sprite,
        x,
        y,
      ),
    );

    x += 58.0;
  }

  x = 451.0;
  y = 131.0;
  for (let i = 0; i < 4; i++) {
    res.push(
      new Box(
        sprite,
        x,
        y,
      ),
    );

    x += 58.0;
  }

  x = 300.0;
  y = 52.0;
  res.push(
    new Box(
      sprite,
      x,
      y,
    ),
  );

  x = 0.0;
  y = 71.0;
  for (let i = 0; i < 3; i++) {
    res.push(
      new Box(
        sprite,
        x,
        y,
      ),
    );

    x += 58.0;
  }

  return res;
};

const generatePills = (tileset: HTMLImageElement): Pill[] => {
  const pinkPillSprite: Sprite = {
    tileset,
    srcX: 162.0,
    srcY: 140.0,
    srcWidth: 62.0,
    srcHeight: 56.0,
  };
  const yellowPillSprite: Sprite = {
    tileset,
    srcX: 244.0,
    srcY: 140.0,
    srcWidth: 58.0,
    srcHeight: 54.0,
  };
  const redPillSprite: Sprite = {
    tileset,
    srcX: 318.0,
    srcY: 144.0,
    srcWidth: 56.0,
    srcHeight: 54.0,
  };

  const res: Pill[] = [];
  let x = 228.0;
  let y = 226.0;

  for (let i = 0; i < 6; i++) {
    const color = (Math.random() * 3) ^ 0;
    let sprite = pinkPillSprite;
    switch (color) {
      case 0:
        sprite = pinkPillSprite;
        break;
      case 1:
        sprite = yellowPillSprite;
        break;
      case 2:
        sprite = redPillSprite;
        break;
    }

    res.push(
      new Pill(
        sprite,
        x,
        y,
      ),
    );

    x += sprite.srcWidth;
  }

  x = 465.0;
  y = 77.0;
  for (let i = 0; i < 2; i++) {
    const color = (Math.random() * 3) ^ 0;
    let sprite = pinkPillSprite;
    switch (color) {
      case 0:
        sprite = pinkPillSprite;
        break;
      case 1:
        sprite = yellowPillSprite;
        break;
      case 2:
        sprite = redPillSprite;
        break;
    }

    res.push(
      new Pill(
        sprite,
        x,
        y,
      ),
    );

    x += sprite.srcWidth;
  }

  x = 303.0;
  y = 4.0;
  for (let i = 0; i < 1; i++) {
    const color = (Math.random() * 3) ^ 0;
    let sprite = pinkPillSprite;
    switch (color) {
      case 0:
        sprite = pinkPillSprite;
        break;
      case 1:
        sprite = yellowPillSprite;
        break;
      case 2:
        sprite = redPillSprite;
        break;
    }

    res.push(
      new Pill(
        sprite,
        x,
        y,
      ),
    );

    x += sprite.srcWidth;
  }

  x = 69.0;
  y = 13.0;
  for (let i = 0; i < 2; i++) {
    const color = (Math.random() * 3) ^ 0;
    let sprite = pinkPillSprite;
    switch (color) {
      case 0:
        sprite = pinkPillSprite;
        break;
      case 1:
        sprite = yellowPillSprite;
        break;
      case 2:
        sprite = redPillSprite;
        break;
    }

    res.push(
      new Pill(
        sprite,
        x,
        y,
      ),
    );

    x += sprite.srcWidth;
  }

  return res;
};

const placeEnemies = (tileset: HTMLImageElement): Enemy[] => {
  const spriteSet: EnemySprites = {
    move1Left: {
      tileset,
      srcX: 152.0,
      srcY: 4.0,
      srcWidth: 82.0,
      srcHeight: 108.0,
    },
    move2Left: {
      tileset,
      srcX: 244.0,
      srcY: 4.0,
      srcWidth: 72.0,
      srcHeight: 104.0,
    },
    move1Right: {
      tileset,
      srcX: 474.0,
      srcY: 4.0,
      srcWidth: 78.0,
      srcHeight: 104.0,
    },
    move2Right: {
      tileset,
      srcX: 565.0,
      srcY: 4.0,
      srcWidth: 70.0,
      srcHeight: 101.0,
    },
  };

  const res: Enemy[] = [
    new Enemy(
      spriteSet,
      560.0,
      26.0,
    ),
    new Enemy(
      spriteSet,
      -30.0,
      12.0,
    ),
  ];

  return res;
};

const placePlayer = (
  tileset: HTMLImageElement,
  guiSettings: Omit<PlayerOptions, 'requiredPills'>,
): Player => {
  const options: PlayerOptions = {
    ...guiSettings,
    requiredPills: 14,
  };
  const spriteSet: PlayerSprites = {
    moveLeft: {
      tileset,
      srcX: 5.0,
      srcY: 4.0,
      srcWidth: 57.0,
      srcHeight: 106.0,
    },
    attackLeft: {
      tileset,
      srcX: 64.0,
      srcY: 4.0,
      srcWidth: 81.0,
      srcHeight: 106.0,
    },
    moveRight: {
      tileset,
      srcX: 332.0,
      srcY: 4.0,
      srcWidth: 50.0,
      srcHeight: 102.0,
    },
    attackRight: {
      tileset,
      srcX: 394.0,
      srcY: 4.0,
      srcWidth: 77.0,
      srcHeight: 102.0,
    },
  };

  return new Player(
    spriteSet,
    35.0,
    178.0,
    options,
  );
};

const placeDoor = (tileset: HTMLImageElement): Door => {
  const sprite: Sprite = {
    tileset,
    srcX: 82.0,
    srcY: 130.0,
    srcWidth: 64.0,
    srcHeight: 70.0,
  };

  return new Door(
    sprite,
    0.0,
    10.0,
  );
};

export const generateScene = (
  canvas: HTMLCanvasElement,
  background: Background,
  tileset: HTMLImageElement,
  guiSettings: Omit<PlayerOptions, 'requiredPills'>,
): GameEngine => {
  const player = placePlayer(tileset, guiSettings);
  const door = placeDoor(tileset);
  const enemies = placeEnemies(tileset);
  const walls = generateWalls(tileset);
  const pills = generatePills(tileset);

  return new GameEngine(
    canvas,
    background,
    [
      player,
      door,
      ...enemies,
      ...walls,
      ...pills,
    ],
  );
};
