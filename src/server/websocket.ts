import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'http';
import WebSocket from 'ws';

import { MpvService } from './mpv';
import { MPV_EVENTS } from './types/MpvEvent';
import { Properties } from './types/MpvProperties';
import type { WsMessage } from './types/WsMessage';
import type { WsResponse } from './types/WsResponse';

dotenv.config();

export class Ws {
  mpv: MpvService;
  wss: WebSocket.Server;
  http: Server;

  constructor(mpv: MpvService) {
    this.mpv = mpv;

    this.wss = new WebSocket.Server({ noServer: true });

    const app = express();

    app.use(express.static('build/client'));

    this.http = app.listen(8080);
    this.http.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (socket) => {
        this.wss.emit('connection', socket, request);
      });
    });

    this.onListening();
    this.onConnection();
    this.registerEvents();
  }

  onListening(): void {
    this.wss.on('listening', () => {
      console.log('Ws: Now listening.');
    });
  }

  onConnection(): void {
    console.log('registering conenction');
    this.wss.on('connection', (client) => {
      console.log('Ws: Client connected.');

      client.on('message', async (data) => {
        const message: WsMessage = JSON.parse(data.toString());
        console.log('Ws: Recieved message\n', message);
        await this.handleMessage(message);
      });

      this.preload();
    });
  }

  // Send initial properties, rename this
  preload(): void {
    const properties: Partial<keyof Properties>[] = [
      'filename',
      'track-list',
      'duration',
      'playback-time',
      'pause',
      'volume',
    ];

    properties.map((property) => {
      this.handleMessage({
        type: 'getProperty',
        property,
      });
    });
  }

  async handleMessage(message: WsMessage): Promise<void> {
    if (message.type === 'getProperty') {
      const value = (await this.mpv.getProperty(message.property)).data;
      this.emit({ ...message, value });
    }
    if (message.type === 'setProperty') {
      await this.mpv.setProperty(message.property, message.value);
    }
    if (message.type === 'cycleProperty') {
      await this.mpv.cycle(message.property);
    }
    if (message.type === 'seek') {
      await this.mpv.seek(message.value, message.mode);
    }
    if (message.type === 'showProgress') {
      await this.mpv.showProgress();
    }
    if (message.type === 'showText') {
      await this.mpv.showText(message.value);
    }
  }

  emit(response: WsResponse): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    });
  }

  // Register all the possible mpv events to be passed to our client
  registerEvents(): void {
    MPV_EVENTS.map((event) => {
      this.mpv.onEvent(event, () => {
        this.emit({
          type: 'event',
          value: event,
        });
      });
    });
  }

  close(): void {
    this.wss.close();
  }
}
