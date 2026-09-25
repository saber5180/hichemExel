'use client';

import StatusPage from '@/components/StatusPage';
import { IconMoney } from '@/components/Icons';

export default function AvoirPage() {
  return (
    <StatusPage
      status="AVOIR"
      title="Tableau des avoirs"
      subtitle="Factures faisant l'objet d'un avoir"
      icon={<IconMoney className="h-5 w-5" />}
      accent="emerald"
      exportName="AVOIR"
    />
  );
}
