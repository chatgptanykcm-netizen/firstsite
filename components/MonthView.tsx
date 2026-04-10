'use client';

import { CalendarEvent } from '@/lib/types';
import { getDaysInMonth, getFirstDayOfMonth, normalizeStatus } from '@/lib/utils';

interface MonthViewProps {
  year: number;
  month: number;
  eventsByDate: Record<string, CalendarEvent[]>;
  onEventClick: (event: CalendarEvent) => void;
  onDayClick?: (dateStr: string) => void;
}

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function getDotColor(status: string): string {
  const s = normalizeStatus(status);
  if (s === 'complete') return '#00d992';
  if (s === 'pending') return '#ffba00';
  if (s === 'cancel') return '#fb565b';
  return '#8b949e';
}

export default function MonthView({ year, month, eventsByDate, onEventClick }: MonthViewProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Build calendar cells: leading empty + days
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ width: '100%' }}>
      {/* Day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid #3d3a39',
        marginBottom: '1px',
      }}>
        {DAY_NAMES.map((day, i) => (
          <div
            key={day}
            style={{
              padding: '10px 0',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: i === 0 ? '#fb565b' : i === 6 ? '#818cf8' : '#8b949e',
              textTransform: 'uppercase',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        backgroundColor: '#3d3a39',
      }}>
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                style={{ backgroundColor: '#050507', minHeight: '100px' }}
              />
            );
          }

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const events = eventsByDate[dateStr] || [];
          const isToday = dateStr === todayStr;
          const dayOfWeek = (firstDay + day - 1) % 7;
          const isSun = dayOfWeek === 0;
          const isSat = dayOfWeek === 6;

          return (
            <div
              key={dateStr}
              style={{
                backgroundColor: isToday ? 'rgba(0,217,146,0.05)' : '#101010',
                minHeight: '100px',
                padding: '8px',
                cursor: events.length > 0 ? 'default' : 'default',
                transition: 'background-color 0.15s',
                position: 'relative',
                border: isToday ? '1px solid rgba(0,217,146,0.4)' : 'none',
              }}
            >
              {/* Day number */}
              <div style={{
                fontSize: '13px',
                fontWeight: isToday ? 700 : 400,
                color: isToday ? '#00d992' : isSun ? '#fb565b' : isSat ? '#818cf8' : '#8b949e',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                {day}
                {isToday && (
                  <span style={{
                    fontSize: '8px',
                    backgroundColor: '#00d992',
                    color: '#050507',
                    padding: '1px 4px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}>
                    오늘
                  </span>
                )}
              </div>

              {/* Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {events.slice(0, 3).map((event, i) => (
                  <button
                    key={i}
                    onClick={() => onEventClick(event)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(61,58,57,0.4)',
                      border: '1px solid #3d3a39',
                      borderRadius: '4px',
                      padding: '3px 6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#00d992';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,217,146,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#3d3a39';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(61,58,57,0.4)';
                    }}
                  >
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: getDotColor(event.status),
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: '11px',
                      color: '#f2f2f2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {event.time ? `${event.time} ` : ''}{event.title}
                    </span>
                  </button>
                ))}
                {events.length > 3 && (
                  <div style={{
                    fontSize: '10px',
                    color: '#8b949e',
                    padding: '2px 6px',
                    letterSpacing: '0.5px',
                  }}>
                    +{events.length - 3}개 더
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
