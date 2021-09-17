import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { TrackList } from '../../server/types/MpvTrackList';
import { WsMessage } from '../../server/types/WsMessage';
import { WsResponse } from '../../server/types/WsResponse';
import { formatDuration } from '../utils/formatDuration';

export type SocketStatus =
  | 'Connecting'
  | 'Reconnecting'
  | 'Connected'
  | 'Disconnected';

export type MpvState = {
  status: SocketStatus;
  tracklist: TrackList;
  isPaused: boolean;
  filename: string;
  duration: number;
  playbackTime: number;
  volume: number;
};

export type Handlers = {
  handlePause: () => void;
  handleSeek: (difference: number) => void;
  handleSeekPercentage: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChangeAudio: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleChangeSub: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleVolume: (event: ChangeEvent<HTMLInputElement>) => void;
};

function wsso(url: string): WebSocket {
  console.log('opening socket');
  return new WebSocket(url);
}

export function useSocket(url = 'ws://localhost:8080'): [MpvState, Handlers] {
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  // use reducer? will clean this shit up NOICELY
  // ALso read the context docs
  // Need to further understand memoization - reference the video from last night
  const [state, setState] = useState<MpvState>({
    status: 'Connecting',
    tracklist: [],
    filename: 'no-file-selected',
    duration: 0,
    playbackTime: 0,
    isPaused: true,
    volume: 0,
  });

  const wsSend = useCallback(
    (message: WsMessage) => {
      if (ws) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws]
  );

  useEffect(() => {
    if (!ws) {
      setWs(wsso(url));
      return;
    }

    console.log('use effect');
    ws.onopen = (): void => {
      setState((state) => Object({ ...state, status: 'Connected' }));

      setInterval(() => {
        wsSend({ type: 'getProperty', property: 'playback-time' });
      }, 1000);
    };

    ws.onclose = (): void => {
      setState((state) => Object({ ...state, status: 'Reconnecting' }));

      setTimeout(() => {
        // useEffect should run this callback because we change call setWs
        console.log('set time out execs');
        setWs(new WebSocket(url));
      }, 1000);
    };

    ws.onmessage = (message): void => {
      try {
        const response: WsResponse = JSON.parse(message.data);
        console.log(response);

        // Handle events
        if (response.type === 'event') {
          if (response.value === 'pause') {
            setState((state) => Object({ ...state, isPaused: true }));
          }
          if (response.value === 'unpause') {
            setState((state) => Object({ ...state, isPaused: false }));
          }
          if (response.value === 'track-switched') {
            wsSend({
              type: 'getProperty',
              property: 'track-list',
            });
          }
          // We will need to account for seek if we remove our interval timer
        }

        if (response.type === 'getProperty') {
          if (response.property === 'volume') {
            setState((state) => Object({ ...state, volume: response.value }));
          }
          if (response.property === 'filename') {
            setState((state) => Object({ ...state, filename: response.value }));
          }
          if (response.property === 'duration') {
            setState((state) => Object({ ...state, duration: response.value }));
          }
          if (response.property === 'playback-time') {
            setState((state) =>
              Object({ ...state, playbackTime: response.value })
            );
          }
          if (response.property === 'pause') {
            setState((state) => Object({ ...state, isPaused: response.value }));
          }
          if (response.property === 'track-list') {
            setState((state) =>
              Object({ ...state, tracklist: response.value })
            );
          }
        }
      } catch {}
    };
  }, [ws, url, wsSend]);

  function handlePause(): void {
    return wsSend({
      type: 'cycleProperty',
      property: 'pause',
    });
  }

  function handleSeek(difference: number): void {
    return wsSend({
      type: 'seek',
      mode: 'absolute',
      value: formatDuration(state.playbackTime + difference),
    });
  }

  function handleSeekPercentage(event: ChangeEvent<HTMLInputElement>): void {
    const percent = event.currentTarget.valueAsNumber;
    if (percent > 0 && percent < 101) {
      return wsSend({
        type: 'seek',
        mode: 'absolute-percent',
        value: percent,
      });
    }
  }

  function handleChangeAudio(event: ChangeEvent<HTMLSelectElement>): void {
    const id = event.target.value;
    return wsSend({
      type: 'setProperty',
      property: 'aid',
      value: id,
    });
  }

  function handleChangeSub(event: ChangeEvent<HTMLSelectElement>): void {
    const id = event.target.value;
    return wsSend({
      type: 'setProperty',
      property: 'sid',
      value: id,
    });
  }

  // This could potentially be used, need to check volume on backend
  function handleVolume(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event.currentTarget);
    const volume = event.currentTarget.valueAsNumber;
    if (volume > 0 && volume < 101) {
      wsSend({ type: 'setProperty', property: 'volume', value: volume });
      wsSend({ type: 'getProperty', property: 'volume' });
    }
  }

  const handlers = {
    handlePause,
    handleSeek,
    handleSeekPercentage,
    handleChangeAudio,
    handleChangeSub,
    handleVolume,
  };
  return [state, handlers];
}
