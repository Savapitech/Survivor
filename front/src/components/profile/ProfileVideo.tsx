import { toEmbedUrl } from '../../utils/video';
import { API_ORIGIN } from '../../api/http';
import type { VideoView } from '../../api/models';
import styles from './ProfileVideo.module.css';

interface ProfileVideoProps {
  videoView: VideoView;
  name: string;
  lastname: string;
  autoplay?: boolean;
  viewerId?: string;
}

function buildLocalStreamUrl(playbackUrl: string, viewerId?: string): string {
  const url = new URL(playbackUrl, API_ORIGIN);
  if (viewerId) url.searchParams.set('viewerId', viewerId);
  return url.toString();
}

export function ProfileVideo({
  videoView,
  name,
  lastname,
  autoplay,
  viewerId,
}: ProfileVideoProps) {
  if (videoView.status === 'processing') {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty} role="status">
          Vidéo en cours de traitement, elle sera bientôt disponible.
        </p>
      </div>
    );
  }

  if (videoView.status === 'unavailable') {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty} role="status">
          Vidéo temporairement indisponible. Le reste du profil reste
          consultable.
        </p>
      </div>
    );
  }

  if (videoView.status !== 'ready' || !videoView.playbackUrl) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>Aucune vidéo de présentation disponible.</p>
      </div>
    );
  }

  const isAppRoute = videoView.playbackUrl.startsWith('/seekers/');
  const embedUrl = isAppRoute
    ? null
    : toEmbedUrl(videoView.playbackUrl, { autoplay });

  return (
    <div className={styles.wrapper}>
      {isAppRoute ? (
        <video
          key={videoView.playbackUrl}
          className={styles.iframe}
          src={buildLocalStreamUrl(videoView.playbackUrl, viewerId)}
          controls
          autoPlay={autoplay}
          muted={autoplay}
          playsInline
        >
          <track kind="captions" />
        </video>
      ) : embedUrl ? (
        <iframe
          key={autoplay ? 'autoplay' : 'static'}
          className={styles.iframe}
          src={embedUrl}
          title={`Vidéo de présentation de ${name} ${lastname}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <p className={styles.empty}>Aucune vidéo de présentation disponible.</p>
      )}
    </div>
  );
}
