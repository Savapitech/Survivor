import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SeekerListItem } from '../../api/models';
import { Badge } from '../ui/Badge';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  seeker: SeekerListItem;
  actions?: ReactNode;
}

export function ProfileCard({ seeker, actions }: ProfileCardProps) {
  return (
    <li className={styles.card}>
      <h3 className={styles.name}>
        <Link className={styles.link} to={`/profils/${seeker.id}`}>
          {seeker.name} {seeker.lastname}
        </Link>
      </h3>
      {seeker.certification && <Badge variant="success">Certifié JEB</Badge>}
      {seeker.competences.length > 0 && (
        <p>{seeker.competences.map((c) => c.competence).join(', ')}</p>
      )}
      {actions && <div className={styles.actions}>{actions}</div>}
    </li>
  );
}
