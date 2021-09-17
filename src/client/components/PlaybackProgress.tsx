import React, { ReactElement } from 'react';

import { Handlers } from '../hooks/useSocket';
import { formatDuration } from '../utils/formatDuration';

interface Props {
  duration: number;
  playbackTime: number;
  onSeekPercentageChange: Handlers['handleSeekPercentage'];
}

export function PlaybackProgress({
  duration,
  playbackTime,
  onSeekPercentageChange,
}: Props): ReactElement {
  const percent = (playbackTime / duration) * 100;

  const playback = formatDuration(playbackTime);
  const remaining = '- ' + formatDuration(duration - playbackTime);

  return (
    <>
      <div className="p-3 pb-1">
        <div className="h-3 relative rounded-lg bg-gray-500">
          {/* <div className="w-full h-full bg-gray-200 absolute" /> */}{' '}
          <div
            className="rounded-lg h-full bg-green-500 absolute"
            style={{ width: percent + '%' }}
          />
          <input
            className="rounded-lg appearance-none bg-gray-500 bg-opacity-0 w-full h-full absolute"
            max={100}
            min={1}
            onChange={onSeekPercentageChange}
            type="range"
            value={percent}
          />
        </div>
      </div>
      <div className="flex justify-between font-sans px-3">
        <span>{playback}</span>
        <span>{remaining}</span>
      </div>
    </>
  );
}
