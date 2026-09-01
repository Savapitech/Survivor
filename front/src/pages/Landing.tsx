import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listSeekers } from '../api/seekers';
import { listRecruiters } from '../api/recruiters';
import { Button } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './Landing.module.css';

export function Landing() {
  useDocumentTitle('Accueil');
  const [certifiedCount, setCertifiedCount] = useState<number | null>(null);
  const [recruiterCount, setRecruiterCount] = useState<number | null>(null);

  useEffect(() => {
    listSeekers({ pageSize: 1 })
      .then((res) => setCertifiedCount(res.total))
      .catch(() => setCertifiedCount(null));
    listRecruiters({ pageSize: 1 })
      .then((res) => setRecruiterCount(res.total))
      .catch(() => setRecruiterCount(null));
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.tagline}>Plateforme d'État</p>
          <h1 className={styles.title}>
            Valorisez vos compétences au-delà du CV
          </h1>
          <p>
            Faites la différence auprès des recruteurs publics et privés grâce à
            une courte vidéo de présentation et valorisez votre parcours via le
            système officiel de certification JEB.
          </p>
          <div className={styles.ctas}>
            <Link to="/inscription/compte">
              <Button variant="primary">Commencer maintenant</Button>
            </Link>
            <Link to="/inscription/compte">
              <Button variant="secondary">
                Découvrir la certification JEB
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title">
        <h2 id="features-title">Une méthode innovante et inclusive</h2>
        <p>
          Conçu pour humaniser les processus de recrutement et garantir
          l'égalité des chances.
        </p>
        <div className={styles.features}>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Vidéo de présentation</h3>
            <p>
              Présentez votre projet professionnel et votre personnalité de
              manière impactante et humaine, directement sur la plateforme.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Certification JEB</h3>
            <p>
              Faites certifier vos compétences clés via le badge de
              labellisation Ministère du Job et Bonheur, une marque de confiance
              et d'excellence.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Mise en relation</h3>
            <p>
              Entrez directement en contact avec des recruteurs engagés et
              sensibles aux compétences et au potentiel humain.
            </p>
          </article>
        </div>
      </section>

      {(certifiedCount !== null || recruiterCount !== null) && (
        <section aria-label="Chiffres clés" className={styles.stats}>
          {certifiedCount !== null && (
            <div>
              <span className={styles.statValue}>{certifiedCount}</span>
              Profils certifiés JEB
            </div>
          )}
          {recruiterCount !== null && (
            <div>
              <span className={styles.statValue}>{recruiterCount}</span>
              Recruteurs inscrits
            </div>
          )}
        </section>
      )}
    </>
  );
}
