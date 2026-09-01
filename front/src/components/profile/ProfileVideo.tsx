import { toEmbedUrl } from '../../utils/video';
import styles from './ProfileVideo.module.css';

interface ProfileVideoProps {
  url: string | null;
  name: string;
  lastname: string;
}

export function ProfileVideo({ url, name, lastname }: ProfileVideoProps) {
  const embedUrl = url ? toEmbedUrl(url) : null;

  return (
    <div className={styles.wrapper}>
      {embedUrl ? (
        <iframe
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
