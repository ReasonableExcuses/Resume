import React from 'react';
import { ClientReport } from './ClientReport';

export function generateStaticParams() {
  return [
    { id: 'analysis-alex-senior-fullstack' },
    { id: 'analysis-priya-senior-data' },
    { id: 'default' },
  ];
}

export default async function AnalysisReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientReport id={id} />;
}
