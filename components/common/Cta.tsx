import Link from "next/link";
import Image from "next/image";

import RevealText from "../animation/RevealText";
import AnimatedButton from "../animation/AnimatedButton";

export default function Cta() {
  return (
    <div className="mxd-section overflow-hidden">
      <div className="mxd-container">
        {/* Block - CTA Start */}
        <div className="mxd-block">
          <div className="mxd-promo">
            <div className="mxd-promo__inner anim-zoom-out-container">
              {/* background */}
              <div className="mxd-promo__bg" />
              {/* caption */}
              <div className="mxd-promo__content">
                <p className="mxd-promo__title anim-uni-in-up">
                  <span className="mxd-promo__icon">
                    <Image
                      alt="Icon"
                      src="/img/icons/300x300_obj-cta-01.webp"
                      width={300}
                      height={300}
                    />
                  </span>
                  <RevealText
                    as="span"
                    className="mxd-promo__caption reveal-type"
                  >
                    ¿Tienes un proyecto en mente?
                  </RevealText>
                </p>
                <div className="mxd-promo__controls anim-uni-in-up">
                  <AnimatedButton
                    text="Hablémoslo"
                    className="btn btn-anim btn-default btn-large btn-additional slide-right-up"
                    href={`/contact`}
                  >
                    <i className="ph-bold ph-arrow-up-right" />
                  </AnimatedButton>
                </div>
              </div>
              {/* parallax images */}
              <div className="mxd-promo__images">
                <Image
                  className="promo-image promo-image-1"
                  alt="Ejemplo de diseño web por 107 Studio"
                  src="/img/illustrations/cta-img-01.webp"
                  width={800}
                  height={912}
                />
                <Image
                  className="promo-image promo-image-2"
                  alt="Proyecto de branding por 107 Studio"
                  src="/img/illustrations/cta-img-02.webp"
                  width={600}
                  height={601}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Block - CTA End */}
      </div>
    </div>
  );
}
