export default function ParallaxBanner() {
  return (
    <div className="mxd-section padding-pre-title">
      <div className="mxd-container">
        <div className="mxd-divider mxd-divider--video">
          <video
            className="mxd-divider__video"
            src="/videos/projects/luminar.webm"
            poster="/img/projects/posters/luminar.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Luminar — landing 3D, demo en vídeo"
          />
        </div>
      </div>
    </div>
  );
}
