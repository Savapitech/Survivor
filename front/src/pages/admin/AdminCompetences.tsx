import {
  createCompetence,
  deleteCompetence,
  listCompetences,
  updateCompetence,
} from '../../api/competences';
import { AdminLookupCrud } from './AdminLookupCrud';

export function AdminCompetences() {
  return (
    <AdminLookupCrud<'competence'>
      title="Compétences"
      fieldKey="competence"
      fieldLabel="une compétence"
      list={listCompetences}
      create={createCompetence}
      update={updateCompetence}
      remove={deleteCompetence}
    />
  );
}
