const pastelGradient = {
  background: "linear-gradient(115deg, #C99AAE 0%, #D9A7A7 28%, #C8A8D4 55%, #A8BFA0 82%, #9DB89A 100%)",
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
            style={pastelGradient}
          >
            LANTLE
          </span>
          <span
            className="mt-0.5 text-[8px] tracking-[0.45em] font-sans font-light"
            style={pastelGradient}
          >
            FLORAL STUDIO
          </span>
        </>
      )}
    </span>
  );
}
