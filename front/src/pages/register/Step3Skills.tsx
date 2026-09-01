import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { listCompetences } from '../../api/competences';
import { listActivitySectors } from '../../api/activitySectors';
import { ChipSelector } from '../../components/ui/ChipSelector';
import { Button } from '../../components/ui/Button';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useAsync } from '../../hooks/useAsync';
import { useWizard } from './wizardState';
import styles from './RegisterWizardLayout.module.css';

export function Step3Skills() {
  useDocumentTitle('Inscription');
  const { state, update } = useWizard();
  const navigate = useNavigate();

  const [competenceIds, setCompetenceIds] = useState(state.competenceIds);
  const [activitySectorIds, setActivitySectorIds] = useState(
    state.activitySectorIds,
  );

  const competences = useAsync(() => listCompetences({ pageSize: 100 }), []);
  const sectors = useAsync(() => listActivitySectors({ pageSize: 100 }), []);

  if (!state.userId || state.role !== 'seeker' || !state.name) {
    return <Navigate to="/inscription/compte" replace />;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    update({ competenceIds, activitySectorIds });
    navigate('/inscription/video');
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={styles.step}>Étape 3 sur 3 - Compétences</p>
      <h1>Vos compétences et votre secteur</h1>

      {competences.loading && <p>Chargement des compétences...</p>}
      {competences.data && (
        <ChipSelector
          legend="Compétences"
          items={competences.data.data.map((c) => ({
            id: c.id,
            label: c.competence,
          }))}
          selectedIds={competenceIds}
          onChange={setCompetenceIds}
        />
      )}

      {sectors.loading && <p>Chargement des secteurs...</p>}
      {sectors.data && (
        <ChipSelector
          legend="Secteur d'activité"
          items={sectors.data.data.map((s) => ({
            id: s.id,
            label: s.activitySector,
          }))}
          selectedIds={activitySectorIds}
          onChange={setActivitySectorIds}
        />
      )}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Retour
        </Button>
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
