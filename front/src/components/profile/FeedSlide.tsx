import { Link } from 'react-router-dom';
import type { SeekerListItem } from '../../api/models';
import { ProfileVideo } from './ProfileVideo';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import styles from './FeedSlide.module.css';

interface FeedSlideProps {
  seeker: SeekerListItem;
  interactive: boolean;
  liked: boolean;
  likeCount: number;
  contacted: boolean;
  favorited: boolean;
  onToggleLike: () => void;
  onContact: () => void;
  onToggleFavorite: () => void;
}

export function FeedSlide({
  seeker,
  interactive,
  liked,
  likeCount,
  contacted,
  favorited,
  onToggleLike,
  onContact,
  onToggleFavorite,
}: FeedSlideProps) {
  const visibleCompetences = seeker.competences.slice(0, 4);
  const hiddenCount = seeker.competences.length - visibleCompetences.length;

  return (
    <li className={styles.slide}>
      <div className={styles.videoBox}>
        <ProfileVideo
          url={seeker.video}
          name={seeker.name}
          lastname={seeker.lastname}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link className={styles.nameLink} to={`/profils/${seeker.id}`}>
            {seeker.name} {seeker.lastname}
          </Link>
        </h3>
        {seeker.certification && <Badge variant="success">Certifié JEB</Badge>}
        {visibleCompetences.length > 0 && (
          <ul className={styles.tags} aria-label="Compétences">
            {visibleCompetences.map((c) => (
              <li key={c.id} className={styles.tag}>
                {c.competence}
              </li>
            ))}
            {hiddenCount > 0 && <li className={styles.tag}>+{hiddenCount}</li>}
          </ul>
        )}
      </div>

      <div className={styles.actions}>
        {interactive ? (
          <Button
            variant={liked ? 'primary' : 'ghost'}
            onClick={onToggleLike}
            aria-pressed={liked}
          >
            <span aria-hidden="true">♦</span> {likeCount}
            <span className="visually-hidden">
              {' '}
              recommandation{likeCount === 1 ? '' : 's'} -{' '}
              {liked ? 'retirer' : 'recommander ce profil'}
            </span>
          </Button>
        ) : (
          <p className={styles.likeCountStatic}>
            <span aria-hidden="true">♦</span> {likeCount}
            <span className="visually-hidden"> recommandation(s)</span>
          </p>
        )}

        {interactive && (
          <>
            <Button
              variant={favorited ? 'primary' : 'ghost'}
              onClick={onToggleFavorite}
              aria-pressed={favorited}
            >
              {favorited ? 'Favori ' : 'Favoris'}
            </Button>
            <Button onClick={onContact} disabled={contacted}>
              {contacted ? 'Contacté ' : 'Contacter'}
            </Button>
          </>
        )}
      </div>
    </li>
  );
}
