import './style.css';

import React, { ReactElement } from 'react';

import { ControlButtons } from './components/ControlButtons';
import { FixedBottom } from './components/FixedBottom';
import { PlaybackProgress } from './components/PlaybackProgress';
import { SocketStatus } from './components/SocketStatus';
import { TrackInformation } from './components/TrackInformation';
import { VolumeSlider } from './components/VolumeSlider';
import { useSocket } from './hooks/useSocket';

export function App(): ReactElement {
  const [state, handlers] = useSocket('ws://localhost:8080');

  return (
    <main className="bg-gray-900 h-screen text-gray-400">
      <h1 className="align-middle text-4xl font-medium px-2 py-1 bg-gray-700 text-gray-200">
        Mpv Remote
      </h1>
      <div className="bg-gray-600 flex items-center">
        <h2 className="align-middle whitespace-no-wrap text-xl overflow-x-auto mx-2 py-1 bg-gray-600 text-gray-100">
          {state.filename || 'Filename N/A'}
        </h2>
      </div>

      <TrackInformation
        onChangeAudio={handlers.handleChangeAudio}
        onChangeSubtitles={handlers.handleChangeSub}
        trackList={state.tracklist}
      />

      <VolumeSlider
        onChangeVolume={handlers.handleVolume}
        volume={state.volume}
      />

      <FixedBottom>
        <PlaybackProgress
          duration={state.duration}
          onSeekPercentageChange={handlers.handleSeekPercentage}
          playbackTime={state.playbackTime}
        />
        <ControlButtons
          isPaused={state.isPaused}
          onPause={handlers.handlePause}
          onSeek={handlers.handleSeek}
        />
        <SocketStatus status={state.status} />
      </FixedBottom>
    </main>
  );
}
