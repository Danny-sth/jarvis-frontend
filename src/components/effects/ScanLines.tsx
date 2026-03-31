export function ScanLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 opacity-[0.04]">
      <div
        className="absolute inset-0 animate-scan"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(220, 20, 60, 0.15) 2px,
            rgba(220, 20, 60, 0.15) 4px
          )`,
        }}
      />
    </div>
  );
}
