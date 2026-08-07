import { NextResponse } from 'next/server';
import URLS from '@/lib/urls';
import API from '@/lib/api';

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const { name } = await params;
  const query = searchParams.get('p');
  const url = name === 'locale' ? URLS.content[name].base + query : URLS.content[name];
  const results = url ? await API.fetch({ url, method: 'GET' }) : null;
  return NextResponse.json(results, { status: results ? 200 : 404 });
}
