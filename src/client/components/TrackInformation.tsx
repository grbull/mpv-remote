/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable jsx-a11y/no-onchange */
import React, { ChangeEvent, ReactElement } from 'react';

import {
  isAudioTrack,
  isSubTrack,
  TrackList,
} from '../../server/types/MpvTrackList';
import { TrackSelect } from './TrackSelect';

interface Props {
  trackList: TrackList;
  onChangeAudio: (event: ChangeEvent<HTMLSelectElement>) => void;
  onChangeSubtitles: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function TrackInformation({
  trackList,
  onChangeAudio,
  onChangeSubtitles,
}: Props): ReactElement {
  const audioTracks = trackList.filter(isAudioTrack);
  const selectedAudioTrack = audioTracks.find((track) => track.selected);

  const subTracks = trackList.filter(isSubTrack);
  const selectedSubTrack = subTracks.find((track) => track.selected);

  // Account for no subs, no audio, etc

  return (
    <fieldset>
      <legend className="text-xl py-1 px-2 mb-3 font-medium min-w-full border-b border-gray-200 border-solid">
        Tracklist
      </legend>
      <TrackSelect
        label="Audio"
        onChange={onChangeAudio}
        selected={selectedAudioTrack}
        tracks={audioTracks}
      />
      <TrackSelect
        label="Subtitles"
        onChange={onChangeSubtitles}
        selected={selectedSubTrack}
        tracks={subTracks}
      />
    </fieldset>
  );
}
