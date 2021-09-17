/* eslint-disable jsx-a11y/no-onchange */
import React, { ChangeEvent, ReactElement } from 'react';

import { AudioTrack, SubTrack } from '../../server/types/MpvTrackList';

interface Props {
  label: string;
  tracks: (AudioTrack | SubTrack)[];
  selected?: AudioTrack | SubTrack;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function TrackSelect({
  tracks,
  selected,
  onChange,
  label,
}: Props): ReactElement {
  const id = label === 'Audio' ? 'audio-track' : 'sub-track';
  return (
    <div className="py-1 px-2 text-lg flex justify-between items-center">
      <label htmlFor={id}>{label}:</label>
      <select
        className="p-1 text-base w-64 bg-gray-700"
        name={id}
        onChange={onChange}
        value={selected?.id}
      >
        {tracks.map((track) => (
          <option key={track.type + track.id} value={track.id}>
            {track.id}: {track.lang} {track.forced && '(forced)'}
          </option>
        ))}
      </select>
    </div>
  );
}

TrackSelect.defaultProps = { selected: undefined };
