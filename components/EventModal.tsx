'use client';

import { useEffect } from 'react';
import { CalendarEvent } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface EventModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    if (!event) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5,5,7,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="fade-in"
        style={{
          backgroundColor: '#101010',
          border: '2px solid #00d992',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: 'rgba(0,0,0,0.7) 0px 20px 60px, rgba(0,217,146,0.1) 0px 0px 0px 1px inset',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '6px', fontFamily: 'SFMono-Regular, monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {event.date} {event.dayOfWeek && `(${event.dayOfWeek})`}
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#f2f2f2',
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {event.title || '(제목 없음)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #3d3a39',
              borderRadius: '6px',
              color: '#8b949e',
              cursor: 'pointer',
              padding: '4px 10px',
              fontSize: '16px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {event.time && (
            <Row label="시간" value={event.time} />
          )}
          {event.department && (
            <Row label="담당 부서" value={event.department} accent />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#8b949e', width: '72px', flexShrink: 0, letterSpacing: '0.5px', textTransform: 'uppercase' }}>상태</span>
            <StatusBadge status={event.status} />
          </div>
          {event.note && (
            <Row label="비고" value={event.note} />
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
      <span style={{
        fontSize: '12px',
        color: '#8b949e',
        width: '72px',
        flexShrink: 0,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        paddingTop: '1px',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '14px',
        color: accent ? '#2fd6a1' : '#f2f2f2',
        lineHeight: 1.5,
      }}>
        {value}
      </span>
    </div>
  );
}
