import { NextResponse } from 'next/server';
import { getSummaryDataSources } from '@/lib/sources/actions.js';
import log from 'xac-loglevel';

export async function POST(request) {
  try {

    const body = await request.json();
  
    const { filters } = body;
    log.debug('api/sources/aggs: Received filters:', filters);
    const result = await getSummaryDataSources(filters);
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    log.error('api/sources/aggs: Error processing POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}