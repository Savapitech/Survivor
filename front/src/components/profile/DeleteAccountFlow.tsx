import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteSeeker } from '../../api/seekers';
import { deleteRecruiter } from '../../api/recruiters';
import { deleteUser } from '../../api/users';
import { useSession } from '../../context/SessionContext';
import { useAnnounce } from '../../context/AnnounceContext';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Modal } from '../ui/Modal';
import { Field } from '../ui/Field';
import modalStyles from '../ui/Modal.module.css';

interface DeleteAccountFlowProps {
  role: 'seeker' | 'recruiter';
  profileId: number;
  userId: string;
}

export function DeleteAccountFlow({
  role,
  profileId,
  userId,
}: DeleteAccountFlowProps) {
  const [stage, setStage] = useState<'idle' | 'confirm' | 'type'>('idle');
  const [confirmationText, setConfirmationText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { logout } = useSession();
  const { announce, announceError } = useAnnounce();
  const navigate = useNavigate();

  async function handleDelete() {
    setDeleting(true);
    try {
      if (role === 'seeker') {
        await deleteSeeker(profileId);
      } else {
        await deleteRecruiter(profileId);
      }
      await deleteUser(userId).catch(() => undefined);
    } catch {
      announceError('La suppression du profil a échoué.');
      setDeleting(false);
      return;
    }
    logout();
    announce('Votre compte a été supprimé.');
    navigate('/');
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setStage('confirm')}>
        Supprimer mon compte
      </Button>

      {stage === 'confirm' && (
        <ConfirmDialog
          title="Êtes-vous certain de vouloir supprimer ?"
          description="Cette action est irréversible : votre profil, vos vidéos et vos interactions seront définitivement supprimés."
          confirmLabel="Continuer"
          variant="destructive"
          onConfirm={() => setStage('type')}
          onCancel={() => setStage('idle')}
        />
      )}

      {stage === 'type' && (
        <Modal
          titleId="delete-type-title"
          title="Confirmation finale"
          onClose={() => setStage('idle')}
        >
          <p>
            Afin de supprimer le compte, veuillez écrire « Supprimer » dans le
            champ ci-dessous.
          </p>
          <Field
            label="Confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
          <div className={modalStyles.actions}>
            <Button variant="secondary" onClick={() => setStage('idle')}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={confirmationText !== 'Supprimer'}
              loading={deleting}
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
