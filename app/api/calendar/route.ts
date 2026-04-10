import { NextResponse } from 'next/server';

const SHEET_ID = '1P--wtuvsTjwTc4ry_fk7GSQmgqqXL9QSUF0ZHNBtw24';
const GID = '0';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CompanyCalendar/1.0)',
      },
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Sheets fetch failed: ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }

    const csv = await res.text();

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error('[calendar API] fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data' },
      { status: 500 }
    );
  }
}
