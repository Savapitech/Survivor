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

export function toEmbedUrl(
  value: string,
  options: { autoplay?: boolean } = {},
): string | null {
  try {
    const url = new URL(value);

    if (YOUTUBE_HOSTS.includes(url.hostname)) {
      const id =
        url.hostname === 'youtu.be'
          ? url.pathname.slice(1)
          : url.searchParams.get('v');
      if (!id) return null;
      const params = options.autoplay ? '?autoplay=1&mute=1' : '';
      return `https://www.youtube.com/embed/${id}${params}`;
    }

    if (VIMEO_HOSTS.includes(url.hostname)) {
      const base =
        url.hostname === 'player.vimeo.com'
          ? value
          : (() => {
              const id = url.pathname.split('/').filter(Boolean)[0];
              return id ? `https://player.vimeo.com/video/${id}` : null;
            })();
      if (!base) return null;
      if (!options.autoplay) return base;
      const separator = base.includes('?') ? '&' : '?';
      return `${base}${separator}autoplay=1&muted=1`;
    }

    return null;
  } catch {
    return null;
  }
}
