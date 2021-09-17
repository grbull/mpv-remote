import {
  faBackward,
  faFastBackward,
  faFastForward,
  faForward,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* eslint-disable react/jsx-no-bind */
import React, { ReactElement } from 'react';

interface Props {
  onPause: () => void;
  onSeek: (seconds: number) => void;
  isPaused: boolean;
}

export function ControlButtons({
  onPause,
  isPaused,
  onSeek,
}: Props): ReactElement {
  return (
    <div className="flex">
      <button
        className="flex-grow py-2 px-4 bg-gray-700 text-gray-200 border-gray-600 border-solid border"
        onClick={(): void => onSeek(-60)}
        type="button"
      >
        <span aria-label="rewind" role="img">
          <FontAwesomeIcon icon={faFastBackward} />
        </span>
      </button>
      <button
        className="flex-grow py-2 px-4 bg-gray-700 text-gray-200 border-gray-600 border-solid border"
        onClick={(): void => onSeek(-15)}
        type="button"
      >
        <span aria-label="rewind" role="img">
          <FontAwesomeIcon icon={faBackward} />
        </span>
      </button>
      <button
        className="py-2 px-16 bg-gray-700 text-gray-200 border-gray-600 border-solid border"
        onClick={onPause}
        type="button"
      >
        {isPaused ? (
          <span aria-label="play" role="img">
            <FontAwesomeIcon icon={faPlay} />
          </span>
        ) : (
          <span aria-label="pause" role="img">
            <FontAwesomeIcon icon={faPause} />
          </span>
        )}
      </button>
      <button
        className="flex-grow py-2 px-4 bg-gray-700 text-gray-200 border-gray-600 border-solid border"
        onClick={(): void => onSeek(+15)}
        type="button"
      >
        <span aria-label="fast-forward" role="img">
          <FontAwesomeIcon icon={faForward} />
        </span>
      </button>
      <button
        className="flex-grow py-2 px-4 bg-gray-700 text-gray-200 border-gray-600 border-solid border"
        onClick={(): void => onSeek(+60)}
        type="button"
      >
        <span aria-label="fast-forward" role="img">
          <FontAwesomeIcon icon={faFastForward} />
        </span>
      </button>
    </div>
  );
}
