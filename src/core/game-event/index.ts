export const GAME_KEYDOWN_EVENT_ID = 1;
export const GAME_KEYPRESS_EVENT_ID = 2;
export const GAME_KEYUP_EVENT_ID = 3;
export const GAME_MOUSEDOWN_EVENT_ID = 4;
export const GAME_MOUSECLICK_EVENT_ID = 5;
export const GAME_MOUSEUP_EVENT_ID = 6;
export const GAME_SCENEMOUSEDOWN_EVENT_ID = 7;
export const GAME_SCENEMOUSECLICK_EVENT_ID = 8;
export const GAME_SCENEMOUSEUP_EVENT_ID = 9;

export interface GameKeydownEvent {
  name: typeof GAME_KEYDOWN_EVENT_ID;
  payload: {
    key: string;
  };
}

export interface GameKeypressEvent {
  name: typeof GAME_KEYPRESS_EVENT_ID;
  payload: {
    key: string;
  };
}

export interface GameKeyupEvent {
  name: typeof GAME_KEYUP_EVENT_ID;
  payload: {
    key: string;
  };
}

export interface GameMousedownEvent {
  name: typeof GAME_MOUSEDOWN_EVENT_ID;
  payload: {
    x: number;
    y: number;
  };
}

export interface GameMouseclickEvent {
  name: typeof GAME_MOUSECLICK_EVENT_ID;
  payload: {
    x: number;
    y: number;
  };
}

export interface GameMouseupEvent {
  name: typeof GAME_MOUSEUP_EVENT_ID;
  payload: {
    x: number;
    y: number;
  };
}

export interface GameSceneMousedownEvent {
  name: typeof GAME_SCENEMOUSEDOWN_EVENT_ID;
  payload: {
    x: number;
    y: number;
  };
}

export interface GameSceneMouseclickEvent {
  name: typeof GAME_SCENEMOUSECLICK_EVENT_ID;
  payload: {
    x: number;
    y: number;
  };
}

export interface GameSceneMouseupEvent {
  name: typeof GAME_SCENEMOUSEUP_EVENT_ID;
  payload: {
    x: number;
    y: number;
  };
}

export type GameEvent = GameKeydownEvent
  | GameKeypressEvent
  | GameKeyupEvent
  | GameMousedownEvent
  | GameMouseclickEvent
  | GameMouseupEvent
  | GameSceneMousedownEvent
  | GameSceneMouseclickEvent
  | GameSceneMouseupEvent;

export const isMouseEvent = (evt: GameEvent): boolean => {
  return evt.name === GAME_MOUSEDOWN_EVENT_ID || evt.name === GAME_MOUSECLICK_EVENT_ID || evt.name === GAME_MOUSEUP_EVENT_ID;
}

export interface GameEventsSubscriptions {
  [prop: string]: boolean;
}
