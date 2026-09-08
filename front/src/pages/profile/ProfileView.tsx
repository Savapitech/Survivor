import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const hasLoggedView = useRef(false);
  const [contacted, setContacted] = useState(false);

  const recruiterId = isRecruiter ? session?.recruiterId : undefined;
  const viewerId = session?.role === 'seeker' ? session.userId : undefined;

  const {
    data: seeker,
    loading,
    error,
    refetch,
  } = useAsync(
    () => getSeeker(id, { recruiterId, viewerId }),
    [id, recruiterId, viewerId],
  );

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
    navigate(`/messagerie?seekerId=${seeker!.id}`);
  }

  return (
    <article>
      <div className={styles.header}>
        <div>
          <h1>
            {seeker.name} {seeker.lastname}
          </h1>
          {seeker.certification ? (
            <>
              <Badge variant="success">Badge de certification obtenu</Badge>
              <p className={styles.noRightsNotice}>
                Ce badge ne confère aucun droit ni avantage réglementaire.
              </p>
            </>
          ) : isOwnProfile ? (
            <Link to="/questionnaire" className={styles.certificationLink}>
              <Badge variant="neutral">
                Non certifié - lancer la certification
              </Badge>
            </Link>
          ) : (
            <Badge variant="neutral">Non certifié</Badge>
          )}
        </div>
      </div>

      {isOwnProfile && seeker.videoStatus === 'pending' && (
        <p role="status" className={styles.moderationNotice}>
          Votre vidéo est en cours de modération. Elle ne sera visible des
          recruteurs et du public qu'après validation.
        </p>
      )}
      {isOwnProfile && seeker.videoStatus === 'rejected' && (
        <p role="alert" className={styles.moderationNoticeError}>
          Votre vidéo a été refusée
          {seeker.videoRejectionReason
            ? ` : ${seeker.videoRejectionReason}`
            : '.'}{' '}
          Vous pouvez déposer une nouvelle vidéo depuis la page de modification
          de votre profil.
        </p>
      )}

      <ProfileVideo
        videoView={seeker.videoView}
        name={seeker.name}
        lastname={seeker.lastname}
        viewerId={viewerId}
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
