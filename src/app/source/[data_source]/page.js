'use client';

import { useParams } from 'next/navigation';
import GridLayout from '@/components/grid/GridLayout';

export default function Page() {
  const params = useParams();
  const data_source = params.data_source;

  return <GridLayout />;
}
