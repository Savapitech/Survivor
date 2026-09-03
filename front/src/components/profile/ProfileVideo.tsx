import { toEmbedUrl } from '../../utils/video';
import styles from './ProfileVideo.module.css';

interface ProfileVideoProps {
  url: string | null;
  name: string;
  lastname: string;
  autoplay?: boolean;
}

export function ProfileVideo({
  url,
  name,
  lastname,
  autoplay,
}: ProfileVideoProps) {
  const embedUrl = url ? toEmbedUrl(url, { autoplay }) : null;

  return (
    <div className={styles.wrapper}>
      {embedUrl ? (
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
