'use client';

import { useParams } from 'next/navigation';
import GridLayout from '@/components/grid/GridLayout';

export default function Page() {
  const params = useParams();
  const dataSource = params.dataSource;

  return(
    <GridLayout/>
  )

}