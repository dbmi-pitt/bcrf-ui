import { NextResponse } from 'next/server';
import URLS from '@/lib/urls';
import API from '@/lib/api';

export async function GET(request, { params }) {
  const { name } = await params;
  const url = URLS.content[name];
  const results = url ? await API.fetch({ url, method: 'GET' }) : null;
  return NextResponse.json(results, { status: results ? 200 : 404 });
}
