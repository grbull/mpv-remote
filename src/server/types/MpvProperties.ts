import type { TrackList } from './MpvTrackList';

// export const PROPERTIES = [
//   'aid',
//   'duration',
//   'filename',
//   'pause',
//   'percent-pos',
//   'playback-time',
//   'track-list',
//   'sid',
//   'vid',
// ] as const;
// type PropertiesTuple = typeof PROPERTIES;
// export type Property = PropertiesTuple[number];

export type Properties = {
  // Audio track id
  aid: number;
  // Total duration of current file
  duration: number;
  filename: string;
  pause: null;
  // Current %
  'percent-pos': number;
  // Current timestamp
  'playback-time': number;
  'track-list': TrackList;
  // Subtitle track id
  sid: number;
  // Video track id
  vid: number;
  volume: number;
};

export type CycleProperties = {
  pause: null;
};
