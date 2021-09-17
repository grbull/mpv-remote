import type { Event } from './MpvEvent';
import type { Properties } from './MpvProperties';

type GetPropertyResponse = {
  type: 'getProperty';
  property: keyof Properties;
  value: Properties[keyof Properties];
};

// The events that we are prassing through
type WsEvent = {
  type: 'event';
  value: Event;
};

export type WsResponse = WsEvent | GetPropertyResponse;
