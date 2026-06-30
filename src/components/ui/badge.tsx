type BadgeProps = {
  house?: 'tracer' | 'noir' | 'foxlock' | 'cipher';
  role?: 'junior' | 'senior' | 'house_leader';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
};

const houseColors = {
  tracer: '#121358',
  noir: '#274C27',
  foxlock: '#4C1A17',
  cipher: '#402561',
};

const baseStyle: React.CSSProperties = {
  fontFamily: "'Special Elite', monospace",
  letterSpacing: '1px',
  textTransform: 'uppercase',
  display: 'inline-flex',
};

export function Badge({ house, role, children, size = 'sm' }: BadgeProps) {
  const sizeStyle: React.CSSProperties = size === 'md'
    ? { fontSize: '11px', padding: '4px 10px' }
    : { fontSize: '7px', padding: '2px 6px' };
  if (house) {
    const color = houseColors[house];
    return (
      <span style={{ ...baseStyle, ...sizeStyle, border: `1px solid ${color}`, color, backgroundColor: `${color}14` }}>
        {children}
      </span>
    );
  }

  if (role) {
    const isSenior = role == 'senior' || role == 'house_leader';
    return (
      <span style={{
        ...baseStyle,
        ...sizeStyle,
        background: isSenior ? 'rgba(139, 32, 32, 0.1)' :
          'rgba(122, 106, 88, 0.12)',
        color: isSenior ? '#8b2020' : '#7A6A58',
      }}>
        {children ?? role.replace('_', ' ')}
      </span>
    );
  }

  return null;
}