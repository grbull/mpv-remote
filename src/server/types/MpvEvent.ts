import type { MpvResponse } from './MpvResponse';

//https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
export const MPV_EVENTS = [
  'pause',
  'unpause',
  'seek',
  'playback-restart',
  'track-switched',
  'audio-reconfig',
  'video-reconfig',
  'end-file',
] as const;
type EventTuple = typeof MPV_EVENTS;
export type Event = EventTuple[number];

export type MpvEvent = {
  event: Event;
};

export type EventHandler = {
  event: Event;
  callback: () => void;
};

export function isEvent(
  response: MpvEvent | MpvResponse<unknown>
): response is MpvEvent {
  return Boolean('event' in response);
}
