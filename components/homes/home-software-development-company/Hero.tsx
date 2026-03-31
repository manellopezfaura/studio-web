import VelocityMarquee from "@/components/animation/VelocityMarquee";
import VideoParallax from "@/components/animation/VideoParallax";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("HomePage.Hero");
  return (
    <div className="mxd-section mxd-hero-section padding-grid-pre-mtext">
      <div className="mxd-hero-03">
        <div className="mxd-hero-03__wrap loading-wrap">
          {/* top part */}
          <div className="mxd-hero-03__top">
            {/* marquee */}
            <div className="mxd-hero-03__marquee loading__item">
              {/* Marquee Start */}
              <VelocityMarquee className="marquee marquee-right--gsap">
                {/* ... existing marquee content ... */}
                {/* item */}
                <div className="marquee__item one-line">
                  <div className="hero-03-marquee__video">
                    <video
                      preload="metadata"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/video/hero/hero-video-02.webp"
                    >
                      <source
                        type="video/mp4"
                        src="/video/hero/hero-video-02.mp4"
                      />
                      <source
                        type="video/webm"
                        src="/video/hero/hero-video-02.webm"
                      />
                    </video>
                  </div>
                </div>
                {/* item */}
                <div className="marquee__item one-line">
                  <div className="hero-03-marquee__image">
                    <Image
                      className="mxd-move"
                      alt="Ilustración 3D decorativa del estudio creativo 107 Studio"
                      src="/img/hero/29_hero-img.webp"
                      width={1000}
                      height={1532}
                      priority
                    />
                  </div>
                </div>
                {/* item */}
                <div className="marquee__item one-line">
                  <div className="hero-03-marquee__video">
                    <video
                      preload="metadata"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/video/hero/hero-video-01.webp"
                    >
                      <source
                        type="video/mp4"
                        src="/video/hero/hero-video-01.mp4"
                      />
                      <source
                        type="video/webm"
                        src="/video/hero/hero-video-01.webm"
                      />
                    </video>
                  </div>
                </div>
                {/* item */}
                <div className="marquee__item one-line">
                  <div className="hero-03-marquee__image">
                    <Image
                      className="mxd-rotate-slow"
                      alt="Formas abstractas 3D en tonos lavanda"
                      src="/img/hero/28_hero-img.webp"
                      width={1410}
                      height={1056}
                    />
                  </div>
                </div>
                {/* item */}
                <div className="marquee__item one-line">
                  <div className="hero-03-marquee__image">
                    <Image
                      className="mxd-move"
                      alt="Huevo frito 3D ilustrado — identidad visual de 107 Studio"
                      src="/img/hero/30_hero-img.webp"
                      width={2152}
                      height={2015}
                    />
                  </div>
                </div>
                {/* item */}
                <div className="marquee__item one-line">
                  <div className="hero-03-marquee__image">
                    <Image
                      className="mxd-pulse-small"
                      alt="Planta de cactus 3D con flor rosa"
                      src="/img/hero/24_hero-img.webp"
                      width={800}
                      height={780}
                    />
                  </div>
                </div>
              </VelocityMarquee>
              {/* Marquee End */}
            </div>
            {/* headline */}
            <div className="mxd-hero-03__headline">
              <p
                className="hero-03-headline__caption loading__item"
                dangerouslySetInnerHTML={{ __html: t.raw("caption") }}
              />
              <h1 className="hero-03-headline__title loading__item">
                <span className="hero-03-headline__hidden">107STUDIO.</span>
                <span
                  className="hero-03-headline__svg-mobile"
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: 0.8,
                    letterSpacing: "-0.03em",
                    fontSize: "clamp(4rem, 13vw, 10rem)",
                  }}
                >
                  107STUDIO.
                </span>
                <span
                  className="hero-03-headline__svg"
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    lineHeight: 0.76,
                    letterSpacing: "-0.03em",
                    fontSize: "clamp(10rem, 17vw, 24rem)",
                  }}
                >
                  107STUDIO.
                </span>
              </h1>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
