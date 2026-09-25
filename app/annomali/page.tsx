'use client';

import StatusPage from '@/components/StatusPage';
import { IconBolt } from '@/components/Icons';

export default function AnnomaliPage() {
  return (
    <StatusPage
      status="ANNOMALI"
      title="Annomali"
      subtitle="Factures présentant une anomalie"
      icon={<IconBolt className="h-5 w-5" />}
      accent="violet"
      exportName="ANNOMALI"
    />
  );
}
