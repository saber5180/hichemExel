'use client';

import StatusPage from '@/components/StatusPage';
import { IconTicket } from '@/components/Icons';

export default function TikeResteauxPage() {
  return (
    <StatusPage
      status="TIKE_RESTEAUX"
      title="Tableau de Tike Resteaux"
      subtitle="Dérogations liées aux tickets restaurant"
      icon={<IconTicket className="h-5 w-5" />}
      accent="sky"
      exportName="TIKE RESTEAUX"
    />
  );
}
