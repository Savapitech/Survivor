import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import {
  StoredVideoFile,
  VideoProvider,
  VideoTechnicalStatus,
} from '../video-provider.interface';
import { VideoProviderUnavailableError } from '../video-provider.errors';

@Injectable()
export class MinistryDummyVideoProvider implements VideoProvider {
  readonly name = 'ministry' as const;

  async store(_file: StoredVideoFile): Promise<{ externalId: string }> {
    return { externalId: randomUUID() };
  }

  async status(_externalId: string): Promise<VideoTechnicalStatus> {
    throw new VideoProviderUnavailableError(
      this.name,
      'The ministerial video instance is not provisioned yet',
    );
  }

  async playbackUrl(_externalId: string): Promise<string | null> {
    throw new VideoProviderUnavailableError(
      this.name,
      'The ministerial video instance is not provisioned yet',
    );
  }

  async delete(_externalId: string): Promise<void> {}
}
