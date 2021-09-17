import type { MpvResponse } from './MpvResponse';

export type QueueItem = {
  request_id: number;
  resolve: (unknown: MpvResponse<any>) => void;
  reject: (reason?: any) => void;
};
