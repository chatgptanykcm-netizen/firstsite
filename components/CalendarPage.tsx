'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, ViewMode } from '@/lib/types';
import { CSV_URL, parseCSV, groupEventsByDate } from '@/lib/utils';
import Header from '@/components/Header';
import MonthView from '@/components/MonthView';
import ListView from '@/components/ListView';
import EventModal from '@/components/EventModal';

const KOREAN_MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(CSV_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCSV(text);
      setEvents(parsed);
      setLastUpdated(new Date().toLocaleString('ko-KR'));
    } catch (e) {
      setError('스프레드시트를 불러오는 데 실패했습니다. 시트 공유 설정을 확인해주세요.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const timer = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const eventsByDate = groupEventsByDate(events);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }
  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  }

  const monthEventCount = events.filter(e =>
    e.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
  ).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050507' }}>
      <Header lastUpdated={lastUpdated} />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 64px' }}>

        {/* Controls bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={prevMonth} style={navBtnStyle}>‹</button>
            <div style={{
              fontSize: '24px',
              fontWeight: 400,
              color: '#f2f2f2',
              letterSpacing: '-0.9px',
              lineHeight: 1.1,
              minWidth: '140px',
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {year}년 <span style={{ color: '#00d992' }}>{KOREAN_MONTHS[month - 1]}</span>
            </div>
            <button onClick={nextMonth} style={navBtnStyle}>›</button>
            <button onClick={goToday} style={todayBtnStyle}>오늘</button>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Event count badge */}
            {!loading && (
              <span style={{
                fontSize: '12px',
                color: '#8b949e',
                fontFamily: 'SFMono-Regular, monospace',
              }}>
                {monthEventCount}건의 일정
              </span>
            )}

            {/* Refresh */}
            <button onClick={fetchData} style={ghostBtnStyle} title="새로고침">
              ↻
            </button>

            {/* View toggle */}
            <div style={{
              display: 'flex',
              border: '1px solid #3d3a39',
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setViewMode('month')}
                style={toggleBtnStyle(viewMode === 'month')}
              >
                📅 월간
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  ...toggleBtnStyle(viewMode === 'list'),
                  borderLeft: '1px solid #3d3a39',
                }}
              >
                ☰ 목록
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#101010',
              border: '1px solid #3d3a39',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 'rgba(92,88,85,0.2) 0px 0px 15px',
            }}
          >
            {viewMode === 'month' ? (
              <MonthView
                year={year}
                month={month}
                eventsByDate={eventsByDate}
                onEventClick={setSelectedEvent}
              />
            ) : (
              <div style={{ padding: '24px' }}>
                <ListView
                  events={events}
                  year={year}
                  month={month}
                  onEventClick={setSelectedEvent}
                />
              </div>
            )}
          </div>
        )}

        {/* Stats footer */}
        {!loading && !error && (
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <StatCard label="전체 일정" value={events.length} />
            <StatCard label="이달 일정" value={monthEventCount} accent />
            <StatCard
              label="완료"
              value={events.filter(e => e.status && (e.status.includes('완료') || e.status.toLowerCase().includes('done'))).length}
              color="#2fd6a1"
            />
          </div>
        )}
      </main>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}

/* ---- Sub-components ---- */

function LoadingSkeleton() {
  return (
    <div style={{
      backgroundColor: '#101010',
      border: '1px solid #3d3a39',
      borderRadius: '8px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <svg className="glow-pulse" width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#00d992" />
      </svg>
      <div style={{ color: '#8b949e', fontSize: '14px' }}>일정을 불러오는 중...</div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#00d992',
            opacity: 0.3 + i * 0.3,
            animation: `glow-pulse ${1 + i * 0.2}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{
      backgroundColor: '#101010',
      border: '1px solid #fb565b',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
      <div style={{ color: '#fb565b', fontSize: '15px', marginBottom: '8px', fontWeight: 600 }}>불러오기 실패</div>
      <div style={{ color: '#8b949e', fontSize: '13px', marginBottom: '24px' }}>{message}</div>
      <button onClick={onRetry} style={{ ...ghostBtnStyle, padding: '10px 20px' }}>
        다시 시도
      </button>
    </div>
  );
}

function StatCard({ label, value, accent, color }: { label: string; value: number; accent?: boolean; color?: string }) {
  return (
    <div style={{
      backgroundColor: '#101010',
      border: `1px solid ${accent ? 'rgba(0,217,146,0.4)' : '#3d3a39'}`,
      borderRadius: '8px',
      padding: '14px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: '100px',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: color || (accent ? '#00d992' : '#f2f2f2'), lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: '#8b949e', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

/* ---- Styles ---- */

const navBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #3d3a39',
  borderRadius: '6px',
  color: '#f2f2f2',
  cursor: 'pointer',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  transition: 'border-color 0.15s, color 0.15s',
};

const todayBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #3d3a39',
  borderRadius: '6px',
  color: '#2fd6a1',
  cursor: 'pointer',
  padding: '6px 12px',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'border-color 0.15s',
};

const ghostBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #3d3a39',
  borderRadius: '6px',
  color: '#f2f2f2',
  cursor: 'pointer',
  padding: '6px 10px',
  fontSize: '14px',
  transition: 'border-color 0.15s',
};

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'rgba(0,217,146,0.1)' : 'transparent',
  border: 'none',
  color: active ? '#2fd6a1' : '#8b949e',
  cursor: 'pointer',
  padding: '7px 14px',
  fontSize: '13px',
  fontWeight: active ? 600 : 400,
  transition: 'background 0.15s, color 0.15s',
});
