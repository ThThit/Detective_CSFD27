type InkStampProps = {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
};

/** Rotated rubber-stamp badge (red border + ink-bleed blend) for case-file flavor. */
export function InkStamp({ children, rotate = -9, className, style }: InkStampProps) {
  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        border: "2.5px solid #8b2020",
        borderRadius: 2,
        color: "#8b2020",
        padding: "4px 10px",
        fontFamily: "var(--font-special-elite), monospace",
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        opacity: 0.55,
        mixBlendMode: "multiply",
        transform: `rotate(${rotate}deg)`,
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
