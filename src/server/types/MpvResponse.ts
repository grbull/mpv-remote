export type MpvResponse<T> = {
  request_id: number;
  data: T;
  error: string;
};
