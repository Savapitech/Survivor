import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Accessibility() {
  useDocumentTitle('Accessibilité');
  return (
    <section>
      <h1>Déclaration d'accessibilité</h1>
    </section>
  );
}
