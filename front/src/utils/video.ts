const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'youtu.be'];
const VIMEO_HOSTS = ['vimeo.com', 'player.vimeo.com'];

export function isAllowedVideoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return [...YOUTUBE_HOSTS, ...VIMEO_HOSTS].includes(url.hostname);
  } catch {
    return false;
  }
}

export function toEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);

    if (YOUTUBE_HOSTS.includes(url.hostname)) {
      const id =
        url.hostname === 'youtu.be'
          ? url.pathname.slice(1)
          : url.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (VIMEO_HOSTS.includes(url.hostname)) {
      if (url.hostname === 'player.vimeo.com') return value;
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}
