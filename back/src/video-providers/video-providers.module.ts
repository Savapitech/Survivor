import { Module } from '@nestjs/common';
import { LocalVideoProvider } from './providers/local-video.provider';
import { MinistryDummyVideoProvider } from './providers/ministry-dummy-video.provider';
import { LinkVideoProvider } from './providers/link-video.provider';
import { VideoProviderRegistry } from './video-provider.registry';

@Module({
  providers: [
    LocalVideoProvider,
    MinistryDummyVideoProvider,
    LinkVideoProvider,
    VideoProviderRegistry,
  ],
  exports: [VideoProviderRegistry, LocalVideoProvider],
})
export class VideoProvidersModule {}
