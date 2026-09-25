'use client';

import StatusPage from '@/components/StatusPage';
import { IconTruck } from '@/components/Icons';

export default function FautteChauffeurPage() {
  return (
    <StatusPage
      status="FAUTTE_CHAUFFEUR"
      title="Fautte Chauffeur"
      subtitle="Litiges imputés au transport"
      icon={<IconTruck className="h-5 w-5" />}
      accent="orange"
      exportName="FAUTTE CHAUFFEUR"
    />
  );
}
