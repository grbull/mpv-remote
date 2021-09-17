import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, ReactElement } from 'react';

interface Props {
  onChangeVolume: (event: ChangeEvent<HTMLInputElement>) => void;
  volume: number;
}

export function VolumeSlider({ onChangeVolume, volume }: Props): ReactElement {
  return (
    <fieldset>
      <legend className="text-xl py-1 px-2 mb-3 font-medium min-w-full border-b border-gray-200 border-solid">
        Volume - {volume}%
      </legend>
      <div className="flex items-center">
        <i className="px-4">
          <FontAwesomeIcon icon={faMinus} />
        </i>
        <input
          className="rounded-lg appearance-none bg-gray-500 h-3 flex-grow"
          max={100}
          min={1}
          onChange={onChangeVolume}
          type="range"
          value={volume}
        />
        <i className="px-4">
          <FontAwesomeIcon icon={faPlus} />
        </i>
      </div>
    </fieldset>
  );
}
