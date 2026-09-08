import { Injectable } from '@nestjs/common';
import { LocalVideoProvider } from './providers/local-video.provider';
import { MinistryDummyVideoProvider } from './providers/ministry-dummy-video.provider';
import { LinkVideoProvider } from './providers/link-video.provider';
import { VideoProvider, VideoProviderName } from './video-provider.interface';
import { VideoProviderUnavailableError } from './video-provider.errors';

@Injectable()
export class VideoProviderRegistry {
  private readonly providers: Record<VideoProviderName, VideoProvider>;

  constructor(
    local: LocalVideoProvider,
    ministry: MinistryDummyVideoProvider,
    link: LinkVideoProvider,
  ) {
    this.providers = { local, ministry, link };
  }

  get(name: VideoProviderName): VideoProvider {
    const provider = this.providers[name];
    if (!provider) {
      throw new VideoProviderUnavailableError(
        name,
        `No video provider is registered for "${name}"`,
      );
    }
    return provider;
  }

  getDefault(): VideoProvider {
    const configured = (process.env.VIDEO_PROVIDER ??
      'local') as VideoProviderName;
    if (configured === 'link' && !this.isLinkProviderEnabled()) {
      throw new Error(
        'VIDEO_PROVIDER=link but the link provider is disabled (set VIDEO_LINK_PROVIDER_ENABLED=true to allow it)',
      );
    }
    return this.get(configured);
  }

  isLinkProviderEnabled(): boolean {
    return process.env.VIDEO_LINK_PROVIDER_ENABLED === 'true';
  }
}
