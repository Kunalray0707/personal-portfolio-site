'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import PortfolioBuilder from '../../../../components/portfolio/PortfolioBuilder';

export default function PortfolioEditorPage() {
  const params = useParams();
  const rawId = params?.id;
  const portfolioId = Array.isArray(rawId) ? rawId[0] : rawId || '';

  return <PortfolioBuilder portfolioId={portfolioId} />;
}
