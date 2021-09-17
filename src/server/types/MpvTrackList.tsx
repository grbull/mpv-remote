export interface BaseTrack {
  id: number;
  type: 'video' | 'audio' | 'sub';
  'src-id': number;
  albumart: boolean;
  default: boolean;
  forced: boolean;
  dependent: boolean;
  external: boolean;
  selected: boolean;
  'ff-index': number;
  codec: string;
}

export interface VideoTrack extends BaseTrack {
  type: 'video';
  'decoder-desc': string;
  'demux-w': number;
  'demux-h': number;
  'demux-fps': number;
}

export interface AudioTrack extends BaseTrack {
  type: 'audio';
  'audio-channels': number;
  'decoder-desc': string;
  'demux-channel-count': number;
  'demux-channels': string;
  'demux-samplerate': number;
  lang: string;
}

export interface SubTrack extends BaseTrack {
  type: 'sub';
  lang: string;
}

export type TrackList = (VideoTrack | AudioTrack | SubTrack)[];

export function isVideoTrack(
  track: VideoTrack | AudioTrack | SubTrack
): track is AudioTrack {
  return Boolean(track.type === 'video');
}

export function isAudioTrack(
  track: VideoTrack | AudioTrack | SubTrack
): track is AudioTrack {
  return Boolean(track.type === 'audio');
}

export function isSubTrack(
  track: VideoTrack | AudioTrack | SubTrack
): track is SubTrack {
  return Boolean(track.type === 'sub');
}
