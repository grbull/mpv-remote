import type { CycleProperties, Properties } from './MpvProperties';
import type { SeekModes } from './MpvSeekModes';

type GetProperty = {
  type: 'getProperty';
  property: keyof Properties;
};

type SetProperty = {
  type: 'setProperty';
  property: keyof Properties;
  value: Properties[keyof Omit<Properties, 'track-list' | 'pause'>];
};

type CycleProperty = {
  type: 'cycleProperty';
  property: keyof CycleProperties;
};
type Seek = {
  type: 'seek';
  mode?: SeekModes;
  value: string | number;
};
type ShowText = {
  type: 'showText';
  value: string;
};
type ShowProgress = {
  type: 'showProgress';
};

export type WsMessage =
  | GetProperty
  | SetProperty
  | CycleProperty
  | Seek
  | ShowText
  | ShowProgress;
