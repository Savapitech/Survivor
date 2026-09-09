import { useState } from 'react';
import { withdrawSeeker, restoreSeeker } from '../../api/seekers';
import { useAnnounce } from '../../context/AnnounceContext';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface WithdrawProfileFlowProps {
  profileId: number;
  withdrawn: boolean;
  onChange: () => void;
}

export function WithdrawProfileFlow({
  profileId,
  withdrawn,
  onChange,
}: WithdrawProfileFlowProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const { announce, announceError } = useAnnounce();

  async function handleWithdraw() {
    setLoading(true);
    try {
      await withdrawSeeker(profileId);
      announce('Votre profil a été retiré du catalogue.');
      onChange();
    } catch {
      announceError('Le retrait du profil a échoué.');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  async function handleRestore() {
    setLoading(true);
    try {
      await restoreSeeker(profileId);
      announce('Votre profil est de nouveau visible dans le catalogue.');
      onChange();
    } catch {
      announceError('La republication du profil a échoué.');
    } finally {
      setLoading(false);
    }
  }

  if (withdrawn) {
    return (
      <Button variant="secondary" loading={loading} onClick={handleRestore}>
        Republier mon profil
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setConfirming(true)}
        disabled={loading}
      >
        Retirer mon profil du catalogue
      </Button>

      {confirming && (
        <ConfirmDialog
          title="Retirer votre profil du catalogue ?"
          description="Votre profil ne sera plus visible dans le catalogue, les recherches, ni via un lien direct. Votre compte est conservé et vous pourrez republier votre profil à tout moment."
          confirmLabel="Retirer mon profil"
          loading={loading}
          onConfirm={handleWithdraw}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
