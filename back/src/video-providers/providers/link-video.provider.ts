import { Injectable } from '@nestjs/common';
import {
  StoredVideoFile,
  VideoProvider,
  VideoTechnicalStatus,
} from '../video-provider.interface';
import { VideoProviderUnavailableError } from '../video-provider.errors';

@Injectable()
export class LinkVideoProvider implements VideoProvider {
  readonly name = 'link' as const;

  async store(_file: StoredVideoFile): Promise<{ externalId: string }> {
    throw new VideoProviderUnavailableError(
      this.name,
      'The link provider does not accept file uploads; store the URL directly',
    );
  }

  async status(_externalId: string): Promise<VideoTechnicalStatus> {
    return 'ready';
  }

  async playbackUrl(externalId: string): Promise<string | null> {
    return externalId;
  }

  async delete(_externalId: string): Promise<void> {}
}
