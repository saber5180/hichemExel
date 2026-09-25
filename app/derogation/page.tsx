'use client';

import StatusPage from '@/components/StatusPage';
import { IconDoc } from '@/components/Icons';

export default function DerogationPage() {
  return (
    <StatusPage
      status="DEROGATION_COMERCIAL"
      title="Dérogation Comercial"
      subtitle="Dérogations accordées par le service commercial"
      icon={<IconDoc className="h-5 w-5" />}
      accent="amber"
      exportName="DEROGATION COMERCIAL"
    />
  );
}
