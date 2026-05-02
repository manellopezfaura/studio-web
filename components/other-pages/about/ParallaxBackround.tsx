export default function ParallaxBackround() {
  return (
    <div className="mxd-section padding-pre-title">
      <div className="mxd-container">
        <div className="mxd-divider mxd-divider--video">
          <video
            className="mxd-divider__video"
            src="/videos/projects/flamingos.webm"
            poster="/img/projects/posters/flamingos.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Flamingos — experimento 3D"
          />
        </div>
      </div>
    </div>
  );
}
