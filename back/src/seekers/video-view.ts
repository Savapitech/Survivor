export type VideoViewStatus = 'none' | 'processing' | 'ready' | 'unavailable';

export interface VideoView {
  status: VideoViewStatus;
  playbackUrl: string | null;
}

export const NO_VIDEO_VIEW: VideoView = { status: 'none', playbackUrl: null };
