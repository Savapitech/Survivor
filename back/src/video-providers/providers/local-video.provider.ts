import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { Injectable, Optional } from '@nestjs/common';
import {
  StoredVideoFile,
  VideoProvider,
  VideoTechnicalStatus,
} from '../video-provider.interface';
import { VideoProviderUnavailableError } from '../video-provider.errors';
import {
  MAX_VIDEO_UPLOAD_BYTES,
  VIDEO_FORMAT_EXTENSIONS,
  detectVideoFormat,
} from '../video-file-signature';

@Injectable()
export class LocalVideoProvider implements VideoProvider {
  readonly name = 'local' as const;

  private readonly storageDir: string;

  constructor(@Optional() storageDir?: string) {
    this.storageDir = resolve(
      storageDir ??
        process.env.VIDEO_STORAGE_DIR ??
        join(process.cwd(), 'storage', 'videos'),
    );
  }

  private pathFor(externalId: string, ext: string): string {
    if (!/^[0-9a-f-]{36}$/i.test(externalId)) {
      throw new VideoProviderUnavailableError(this.name, 'Invalid video id');
    }
    return join(this.storageDir, `${externalId}.${ext}`);
  }

  private async findFile(externalId: string): Promise<string | null> {
    for (const ext of Object.values(VIDEO_FORMAT_EXTENSIONS)) {
      const candidate = this.pathFor(externalId, ext);
      try {
        await fs.access(candidate);
        return candidate;
      } catch {}
    }
    return null;
  }

  async store(file: StoredVideoFile): Promise<{ externalId: string }> {
    if (file.buffer.byteLength > MAX_VIDEO_UPLOAD_BYTES) {
      throw new VideoProviderUnavailableError(
        this.name,
        'File exceeds the maximum allowed size',
      );
    }
    const format = detectVideoFormat(file.buffer);
    if (!format) {
      throw new VideoProviderUnavailableError(
        this.name,
        'Unrecognised video file content',
      );
    }

    await fs.mkdir(this.storageDir, { recursive: true });
    const externalId = randomUUID();
    const destination = this.pathFor(
      externalId,
      VIDEO_FORMAT_EXTENSIONS[format],
    );
    await fs.writeFile(destination, file.buffer);
    return { externalId };
  }

  async status(externalId: string): Promise<VideoTechnicalStatus> {
    const file = await this.findFile(externalId);
    return file ? 'ready' : 'error';
  }

  async playbackUrl(externalId: string): Promise<string | null> {
    const file = await this.findFile(externalId);
    if (!file) return null;
    return `/media/videos/${externalId}`;
  }

  async getFilePath(externalId: string): Promise<string | null> {
    return this.findFile(externalId);
  }

  async delete(externalId: string): Promise<void> {
    const file = await this.findFile(externalId);
    if (!file) return;
    await fs.unlink(file);
  }
}
