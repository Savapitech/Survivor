import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSeeker } from '../../api/seekers';
import {
  createInteraction,
  listSent,
  removeLike,
} from '../../api/interactions';
import { useSession } from '../../context/SessionContext';
import { useAnnounce } from '../../context/AnnounceContext';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ProfileVideo } from '../../components/profile/ProfileVideo';
import { SkillTags } from '../../components/profile/SkillTags';
import { DeleteAccountFlow } from '../../components/profile/DeleteAccountFlow';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import styles from './ProfileView.module.css';

export function ProfileView() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { session, isRecruiter } = useSession();
  const { announce } = useAnnounce();
  const navigate = useNavigate();
  const hasLoggedView = useRef(false);
  const [contacted, setContacted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeDelta, setLikeDelta] = useState(0);

  const {
    data: seeker,
    loading,
    error,
    refetch,
  } = useAsync(() => getSeeker(id), [id]);

  useDocumentTitle(seeker ? `${seeker.name} ${seeker.lastname}` : 'Profil');

  useEffect(() => {
    if (
      !seeker ||
      !isRecruiter ||
      !session?.recruiterId ||
      hasLoggedView.current
    )
      return;
    hasLoggedView.current = true;
    createInteraction({
      type: 'view',
      recruiterId: session.recruiterId,
      seekerId: seeker.id,
    }).catch(() => undefined);
  }, [seeker, isRecruiter, session?.recruiterId]);

  useEffect(() => {
    if (!seeker || !isRecruiter || !session?.recruiterId) return;
    listSent(session.recruiterId, { type: 'like', pageSize: 100 })
      .then((res) => setLiked(res.data.some((i) => i.seeker.id === seeker.id)))
      .catch(() => undefined);
  }, [seeker, isRecruiter, session?.recruiterId]);

  if (loading) return <LoadingState label="Chargement du profil..." />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!seeker) return null;

  const isOwnProfile =
    session?.role === 'seeker' && session.seekerId === seeker.id;

  async function handleContact() {
    if (!session?.recruiterId) return;
    await createInteraction({
      type: 'contact',
      recruiterId: session.recruiterId,
      seekerId: seeker!.id,
    });
    setContacted(true);
    announce(`${seeker!.name} à été contacté.`);
    navigate(`/messagerie?seekerId=${seeker!.id}`);
  }

  async function handleToggleLike() {
    if (!session?.recruiterId) return;
    if (liked) {
      await removeLike(session.recruiterId, seeker!.id);
      setLiked(false);
      setLikeDelta((d) => d - 1);
      announce('Recommandation retirée.');
    } else {
      await createInteraction({
        type: 'like',
        recruiterId: session.recruiterId,
        seekerId: seeker!.id,
      });
      setLiked(true);
      setLikeDelta((d) => d + 1);
      announce(`${seeker!.name} a été recommandé.`);
    }
  }

  return (
    <article>
      <div className={styles.header}>
        <div>
          <h1>
            {seeker.name} {seeker.lastname}
          </h1>
          {seeker.certification ? (
            <Badge variant="success">Certifié JEB</Badge>
          ) : isOwnProfile ? (
            <Link to="/questionnaire" className={styles.certificationLink}>
              <Badge variant="neutral">
                Non certifié - lancer la certification
              </Badge>
            </Link>
          ) : (
            <Badge variant="neutral">Non certifié</Badge>
          )}
          <p className={styles.likeCount}>
            <span aria-hidden="true">♦</span> {seeker.likeCount + likeDelta}{' '}
            recommandation
            {seeker.likeCount + likeDelta === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <ProfileVideo
        url={seeker.video}
        name={seeker.name}
        lastname={seeker.lastname}
      />

      <SkillTags
        label="Compétences"
        items={seeker.competences}
        getText={(c) => c.competence}
      />
      <SkillTags
        label="Secteurs d'activité"
        items={seeker.activitySectors}
        getText={(s) => s.activitySector}
      />
      <SkillTags
        label="Localisations"
        items={seeker.localisations}
        getText={(l) => l.localisation}
      />

      {isOwnProfile && (
        <div className={styles.actions}>
          <Link to={`/profils/${seeker.id}/modifier`}>
            <Button variant="secondary">Modifier mon profil</Button>
          </Link>
          <DeleteAccountFlow
            role="seeker"
            profileId={seeker.id}
            userId={seeker.user.id}
          />
        </div>
      )}

      {isRecruiter && !isOwnProfile && (
        <div className={styles.actions}>
          <Button onClick={handleContact} disabled={contacted}>
            {contacted ? 'Contacté ' : `Contacter ${seeker.name}`}
          </Button>
          <Button
            variant={liked ? 'primary' : 'ghost'}
            onClick={handleToggleLike}
            aria-pressed={liked}
          >
            {liked ? 'Recommandé' : 'Recommander'}
          </Button>
        </div>
      )}
    </article>
  );
}
