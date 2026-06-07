const goldGradient = {
  background: "linear-gradient(135deg, #B8903A 0%, #E8C96A 35%, #F5DFA0 50%, #C9A84C 70%, #A87830 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export default function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      {showText && (
        <>
          <span
            className="font-serif text-[26px] tracking-[0.25em] font-normal"
            style={goldGradient}
          >
            LANTLE
          </span>
          <span
            className="mt-0.5 text-[8px] tracking-[0.45em] font-sans font-light"
            style={goldGradient}
          >
            FLORAL STUDIO
          </span>
        </>
      )}
    </span>
  );
}
