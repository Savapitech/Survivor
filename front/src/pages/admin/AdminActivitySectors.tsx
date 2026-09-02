import {
  createActivitySector,
  deleteActivitySector,
  listActivitySectors,
  updateActivitySector,
} from '../../api/activitySectors';
import { AdminLookupCrud } from './AdminLookupCrud';

export function AdminActivitySectors() {
  return (
    <AdminLookupCrud<'activitySector'>
      title="Secteurs d'activité"
      fieldKey="activitySector"
      fieldLabel="un secteur d'activité"
      list={listActivitySectors}
      create={createActivitySector}
      update={updateActivitySector}
      remove={deleteActivitySector}
    />
  );
}
