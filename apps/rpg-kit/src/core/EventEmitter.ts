import type { GameObject, ImageState, Level, Vector2 } from "@/core";
import { Npc } from "@/gameObjects";

type EventListener<T> = {
  id: number;
  eventName: keyof T;
  caller: GameObject;
  fn: (payload: any) => any;
};

type EventPayloadMap = {
  HERO_POSITION: Vector2;
  HERO_PICKS_UP_ITEM: { image: ImageState; position: Vector2 };
  HERO_EXIT: void;
  CHANGE_LEVEL: Level;
  HERO_REQUEST_ACTION: Npc;
  START_TEXT_BOX: void;
  END_TEXT_BOX: void;
};

class EventEmitter<EventTypes> {
  listeners: EventListener<EventTypes>[] = [];
  nextId = 0;

  emit<T extends EventTypes, K extends keyof EventTypes>(eventName: K, payload?: T[K]) {
    this.listeners.forEach((it) => {
      if (it.eventName === eventName) {
        it.fn(payload);
      }
    });
  }

  on<T extends EventTypes, K extends keyof EventTypes>(
    eventName: K,
    caller: GameObject,
    fn: (payload: T[K]) => any,
  ) {
    this.nextId += 1;
    this.listeners.push({ id: this.nextId, eventName, caller, fn });
    return this.nextId;
  }

  off(id: number) {
    this.listeners = this.listeners.filter((it) => it.id !== id);
  }

  unsubscribe(caller: GameObject) {
    this.listeners = this.listeners.filter((it) => it.caller !== caller);
  }
}

export const eventEmitter = new EventEmitter<EventPayloadMap>();
