export type VideoProviderName = 'local' | 'ministry' | 'link';

export type VideoTechnicalStatus = 'processing' | 'ready' | 'error';

export interface StoredVideoFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface VideoProvider {
  readonly name: VideoProviderName;

  store(file: StoredVideoFile): Promise<{ externalId: string }>;

  status(externalId: string): Promise<VideoTechnicalStatus>;

  playbackUrl(externalId: string): Promise<string | null>;

  delete(externalId: string): Promise<void>;
}
