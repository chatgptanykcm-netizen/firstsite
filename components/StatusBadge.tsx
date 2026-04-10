import { normalizeStatus, getStatusLabel } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  small?: boolean;
}

export default function StatusBadge({ status, small }: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  const label = getStatusLabel(status);

  const classMap: Record<string, string> = {
    complete: 'status-complete',
    pending: 'status-pending',
    cancel: 'status-cancel',
    default: 'status-default',
  };

  return (
    <span
      className={classMap[normalized]}
      style={{
        display: 'inline-block',
        padding: small ? '1px 6px' : '2px 8px',
        borderRadius: '9999px',
        border: '1px solid',
        fontSize: small ? '10px' : '11px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
