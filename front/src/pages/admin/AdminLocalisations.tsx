import {
  createLocalisation,
  deleteLocalisation,
  listLocalisations,
  updateLocalisation,
} from '../../api/localisations';
import { AdminLookupCrud } from './AdminLookupCrud';

export function AdminLocalisations() {
  return (
    <AdminLookupCrud<'localisation'>
      title="Localisations"
      fieldKey="localisation"
      fieldLabel="une localisation"
      list={listLocalisations}
      create={createLocalisation}
      update={updateLocalisation}
      remove={deleteLocalisation}
    />
  );
}
