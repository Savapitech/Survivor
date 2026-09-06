export class VideoProviderUnavailableError extends Error {
  constructor(providerName: string, message = 'Video provider is unavailable') {
    super(`[${providerName}] ${message}`);
    this.name = 'VideoProviderUnavailableError';
  }
}

export class UnsupportedVideoFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedVideoFileError';
  }
}
