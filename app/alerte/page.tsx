'use client';

import StatusPage from '@/components/StatusPage';
import { IconAlert } from '@/components/Icons';

export default function AlertePage() {
  return (
    <StatusPage
      status="ALERTE"
      title="Tableau des alertes"
      subtitle="Factures à traiter en priorité"
      icon={<IconAlert className="h-5 w-5" />}
      accent="rose"
      exportName="ALERTE"
    />
  );
}
