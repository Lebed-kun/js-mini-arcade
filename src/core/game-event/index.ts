export interface GameKeydownEvent {
  name: 'keydown';
  payload: {
    key: string;
  };
}

export interface GameKeypressEvent {
  name: 'keypress';
  payload: {
    key: string;
  };
}

export interface GameKeyupEvent {
  name: 'keyup';
  payload: {
    key: string;
  };
}

export interface GameMousedownEvent {
  name: 'mousedown';
  payload: {
    x: number;
    y: number;
  };
}

export interface GameMouseclickEvent {
  name: 'mouseclick';
  payload: {
    x: number;
    y: number;
  };
}

export interface GameMouseupEvent {
  name: 'mouseup';
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
  | GameMouseupEvent;

export const isMouseEvent = (evt: GameEvent): boolean => {
  return evt.name === 'mousedown' || evt.name === 'mouseclick' || evt.name === 'mouseup';
}

export interface GameEventsSubscriptions {
  [prop: string]: boolean;
}
