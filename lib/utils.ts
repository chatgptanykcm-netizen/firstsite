import { CalendarEvent, ParsedDate } from './types';

const SHEET_ID = '1P--wtuvsTjwTc4ry_fk7GSQmgqqXL9QSUF0ZHNBtw24';
const GID = '0';

export const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

export function parseDate(raw: string): ParsedDate | null {
  if (!raw || raw.trim() === '') return null;

  // Try YYYY-MM-DD
  const iso = raw.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  if (iso) {
    return { year: parseInt(iso[1]), month: parseInt(iso[2]), day: parseInt(iso[3]) };
  }

  // Try MM/DD/YYYY or MM.DD.YYYY
  const mdy = raw.match(/(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/);
  if (mdy) {
    return { year: parseInt(mdy[3]), month: parseInt(mdy[1]), day: parseInt(mdy[2]) };
  }

  // Try Korean format: YYYY년 MM월 DD일
  const kr = raw.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (kr) {
    return { year: parseInt(kr[1]), month: parseInt(kr[2]), day: parseInt(kr[3]) };
  }

  // Try MM월 DD일 (no year — use current year)
  const krShort = raw.match(/(\d{1,2})월\s*(\d{1,2})일/);
  if (krShort) {
    return { year: new Date().getFullYear(), month: parseInt(krShort[1]), day: parseInt(krShort[2]) };
  }

  return null;
}

export function toDateString(pd: ParsedDate): string {
  return `${pd.year}-${String(pd.month).padStart(2, '0')}-${String(pd.day).padStart(2, '0')}`;
}

export function normalizeStatus(raw: string): 'complete' | 'pending' | 'cancel' | 'default' {
  const s = (raw || '').trim().toLowerCase();
  if (s.includes('완료') || s.includes('complete') || s.includes('done') || s === '✓' || s === 'o') return 'complete';
  if (s.includes('취소') || s.includes('cancel') || s.includes('x') || s === '✗') return 'cancel';
  if (s.includes('진행') || s.includes('예정') || s.includes('pending') || s.includes('ing')) return 'pending';
  return 'default';
}

export function parseCSV(csvText: string): CalendarEvent[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Skip header row (first line)
  const dataLines = lines.slice(1);

  const events: CalendarEvent[] = [];

  for (const line of dataLines) {
    // Basic CSV parse (handles quoted fields)
    const cols = parseCSVLine(line);
    if (!cols || cols.length === 0) continue;

    const rawDate = (cols[0] || '').trim();
    if (!rawDate) continue;

    const parsed = parseDate(rawDate);
    if (!parsed) continue;

    const event: CalendarEvent = {
      date: toDateString(parsed),
      dayOfWeek: (cols[1] || '').trim(),
      time: (cols[2] || '').trim(),
      title: (cols[3] || '').trim(),
      department: (cols[4] || '').trim(),
      status: (cols[5] || '').trim(),
      note: (cols[6] || '').trim(),
    };

    if (event.title || event.department) {
      events.push(event);
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export function getStatusLabel(status: string): string {
  const s = normalizeStatus(status);
  if (s === 'complete') return '완료';
  if (s === 'pending') return '진행중';
  if (s === 'cancel') return '취소';
  return status || '예정';
}

export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay(); // 0=Sun
}
