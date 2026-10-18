// The hero box's background: three blurred colour blobs drifting slowly (blue, violet, cyan), under a
// faint dot grid that fades out towards the edges. CSS only; the drift stops for reduced motion.
export function HeroBackground() {
  return (
    <>
      <div className="hero-blob right-[5%] top-[10%] size-[380px] bg-[var(--hero-accent)] opacity-40 [animation-duration:14s] [animation-name:hero-drift-a]" />
      <div className="hero-blob right-[30%] bottom-[-10%] size-[320px] bg-violet-500 opacity-30 [animation-duration:18s] [animation-name:hero-drift-b]" />
      <div className="hero-blob left-[-5%] top-[-15%] size-[300px] bg-cyan-500 opacity-20 [animation-duration:16s] [animation-name:hero-drift-c]" />
      <div className="hero-dots absolute inset-0" />
    </>
  );
}
