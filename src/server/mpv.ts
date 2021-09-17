import net from 'net';

import type { EventHandler, MpvEvent } from './types/MpvEvent';
import { isEvent } from './types/MpvEvent';
import type { CycleProperties, Properties } from './types/MpvProperties';
import type { MpvResponse } from './types/MpvResponse';
import type { SeekModes } from './types/MpvSeekModes';
import type { QueueItem } from './types/QueueItem';

export class MpvService {
  private readonly client: net.Socket;
  private request_id = 0;
  private queue: QueueItem[] = [];
  private eventHandlers: EventHandler[] = [];

  constructor(socket = '/tmp/mpvSocket') {
    this.client = net.createConnection(socket);
    this.client.on('data', (data) => this.listen(data));
  }

  onConnect(callback: () => void): void {
    this.client.on('connect', () => callback());
  }

  onDisconnect(callback: () => void): void {
    this.client.on('close', () => callback());
  }

  onError(callback: (error: Error) => void): void {
    this.client.on('error', (error) => callback(error));
  }

  onEvent(
    event: EventHandler['event'],
    callback: EventHandler['callback']
  ): void {
    this.eventHandlers.push({ event, callback });
  }

  listen(data: Buffer): void {
    data
      .toString()
      .split('\n')
      .filter((message) => message.length > 0)
      .map((message): MpvResponse<unknown> | MpvEvent => JSON.parse(message))
      // .map((message) => {
      //   console.log(message);
      //   return message;
      // })
      .map((response) =>
        isEvent(response)
          ? this.handleEvent(response)
          : this.handleResponse(response)
      );
  }

  handleEvent(event: MpvEvent): void {
    console.log(event);
    this.eventHandlers
      .filter((handler) => handler.event === event.event)
      .map((handler) => handler.callback());
  }

  handleResponse(response: MpvResponse<unknown>): void {
    const request = this.queue.find(
      ({ request_id }) => request_id === response.request_id
    );

    if (!request) {
      return;
    }
    this.queue.splice(this.queue.indexOf(request), 1);

    if (response.error !== 'success') {
      request.reject(response.error);
    } else {
      request.resolve(response);
    }
  }

  emit<T extends unknown>(command: string[]): Promise<MpvResponse<T>> {
    const request_id = this.request_id;
    this.request_id++;
    this.client.write(JSON.stringify({ command, request_id }) + '\n');
    return new Promise((resolve, reject) => {
      this.queue.push({ request_id, resolve, reject });
    });
  }

  showText(value: string): Promise<MpvResponse<null>> {
    // Should escape this?
    return this.emit(['show-text', value]);
  }

  showProgress(): Promise<MpvResponse<null>> {
    return this.emit(['show-progress']);
  }

  getProperty<T extends keyof Properties>(
    property: T
  ): Promise<MpvResponse<Properties[T]>> {
    // check the property
    return this.emit(['get_property', property]);
  }

  setProperty<T extends keyof Properties>(
    property: T,
    value: number | string
  ): Promise<MpvResponse<undefined>> {
    // check the property
    return this.emit(['set_property', property, value.toString()]);
  }

  cycle<T extends keyof CycleProperties>(
    property: T
  ): Promise<MpvResponse<CycleProperties[T]>> {
    // check the property
    return this.emit(['cycle', property]);
  }

  seek(
    value: number | string,
    mode: SeekModes = 'absolute-percent'
  ): Promise<MpvResponse<null>> {
    return this.emit(['seek', value.toString(), mode]);
  }
}
