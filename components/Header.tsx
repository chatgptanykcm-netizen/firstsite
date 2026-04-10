'use client';

interface HeaderProps {
  lastUpdated?: string;
}

export default function Header({ lastUpdated }: HeaderProps) {
  return (
    <header
      style={{
        backgroundColor: '#050507',
        borderBottom: '1px solid #3d3a39',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg
            className="glow-pulse"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              fill="#00d992"
              stroke="#00d992"
              strokeWidth="0.5"
            />
          </svg>
          <div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#f2f2f2',
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Company <span style={{ color: '#00d992' }}>Calendar</span>
            </h1>
          </div>
        </div>

        {/* Right: last updated */}
        {lastUpdated && (
          <div
            style={{
              fontSize: '12px',
              color: '#8b949e',
              fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            업데이트: {lastUpdated}
          </div>
        )}
      </div>
    </header>
  );
}
