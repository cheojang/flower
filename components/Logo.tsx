const pastelGradient = {
  background: "linear-gradient(115deg, #B06A85 0%, #C77E8C 26%, #A877C4 54%, #7FA86E 82%, #6E9A66 100%)",
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
            className="font-serif text-[28px] font-bold tracking-[0.28em]"
            style={pastelGradient}
          >
            LANTLE
          </span>
          <span
            className="mt-1 text-[9px] font-sans font-semibold tracking-[0.48em] text-sage-deep"
          >
            FLORAL STUDIO
          </span>
        </>
      )}
    </span>
  );
}
