'use client';

import { CalendarEvent } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface ListViewProps {
  events: CalendarEvent[];
  year: number;
  month: number;
  onEventClick: (event: CalendarEvent) => void;
}

function groupByDate(events: CalendarEvent[]): { date: string; events: CalendarEvent[] }[] {
  const map: Record<string, CalendarEvent[]> = {};
  for (const ev of events) {
    if (!map[ev.date]) map[ev.date] = [];
    map[ev.date].push(ev);
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, events]) => ({ date, events }));
}

function formatDateHeader(dateStr: string, dayOfWeek: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(m)}월 ${parseInt(d)}일 ${dayOfWeek ? `(${dayOfWeek})` : ''}`;
}

const DAY_COLORS: Record<string, string> = {
  '일': '#fb565b',
  '월': '#f2f2f2',
  '화': '#f2f2f2',
  '수': '#f2f2f2',
  '목': '#f2f2f2',
  '금': '#f2f2f2',
  '토': '#818cf8',
};

export default function ListView({ events, year, month, onEventClick }: ListViewProps) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthEvents = events.filter(e => e.date.startsWith(prefix));
  const groups = groupByDate(monthEvents);

  if (groups.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '64px 24px',
        color: '#8b949e',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
        <div style={{ fontSize: '16px', fontWeight: 500 }}>이달 일정이 없습니다</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {groups.map(({ date, events: dayEvents }) => {
        const dayOfWeek = dayEvents[0]?.dayOfWeek || '';
        const dayColor = DAY_COLORS[dayOfWeek] || '#f2f2f2';
        const [, m, d] = date.split('-');

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        const isToday = date === todayStr;

        return (
          <div key={date}>
            {/* Date header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '10px',
              paddingBottom: '8px',
              borderBottom: `1px solid ${isToday ? 'rgba(0,217,146,0.4)' : '#3d3a39'}`,
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: isToday ? 'rgba(0,217,146,0.15)' : '#101010',
                border: `1px solid ${isToday ? '#00d992' : '#3d3a39'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: isToday ? '#00d992' : dayColor, lineHeight: 1 }}>
                  {parseInt(d)}
                </span>
                <span style={{ fontSize: '9px', color: isToday ? '#00d992' : '#8b949e', letterSpacing: '0.5px' }}>
                  {dayOfWeek || ''}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: dayColor, letterSpacing: '-0.3px' }}>
                  {parseInt(m)}월 {parseInt(d)}일
                  {dayOfWeek && <span style={{ marginLeft: '6px', fontSize: '13px', fontWeight: 400, color: '#8b949e' }}>({dayOfWeek})</span>}
                </div>
                {isToday && (
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: '#00d992',
                    color: '#050507',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}>TODAY</span>
                )}
              </div>
              <div style={{ flex: 1, borderBottom: '1px dashed rgba(79,93,117,0.3)', marginTop: '2px' }} />
              <span style={{ fontSize: '12px', color: '#8b949e' }}>{dayEvents.length}건</span>
            </div>

            {/* Events */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '52px' }}>
              {dayEvents.map((event, i) => (
                <button
                  key={i}
                  onClick={() => onEventClick(event)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    backgroundColor: '#101010',
                    border: '1px solid #3d3a39',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = '#00d992';
                    el.style.boxShadow = 'rgba(92,88,85,0.2) 0px 0px 15px';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = '#3d3a39';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Time */}
                  <div style={{
                    minWidth: '52px',
                    fontSize: '13px',
                    color: '#8b949e',
                    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    paddingTop: '1px',
                    flexShrink: 0,
                  }}>
                    {event.time || '—'}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#f2f2f2',
                      marginBottom: event.department || event.note ? '6px' : 0,
                      letterSpacing: '-0.3px',
                    }}>
                      {event.title || '(제목 없음)'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {event.department && (
                        <span style={{ fontSize: '12px', color: '#2fd6a1' }}>
                          {event.department}
                        </span>
                      )}
                      {event.note && (
                        <span style={{ fontSize: '12px', color: '#8b949e' }}>
                          {event.note}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink: 0 }}>
                    <StatusBadge status={event.status} small />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
