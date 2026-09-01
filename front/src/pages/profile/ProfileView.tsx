import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSeeker } from '../../api/seekers';
import { createInteraction } from '../../api/interactions';
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
  const hasLoggedView = useRef(false);
  const [contacted, setContacted] = useState(false);

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
          ) : (
            <Badge variant="neutral">Certification en cours</Badge>
          )}
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
        </div>
      )}
    </article>
  );
}
