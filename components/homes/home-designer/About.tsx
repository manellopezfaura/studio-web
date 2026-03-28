import Link from "next/link";
import Image from "next/image";

import RevealText from "@/components/animation/RevealText";
import AnimatedButton from "@/components/animation/AnimatedButton";

export default function About() {
  return (
    <div className="mxd-section padding-pre-grid">
      <div className="mxd-container grid-l-container">
        {/* Block - About Description with Manifest Start */}
        <div className="mxd-block">
          <div className="container-fluid px-0">
            <div className="row gx-0">
              <div className="col-12 col-xl-6 mxd-grid-item-l no-margin anim-uni-in-up">
                {/* Photo removed */}
              </div>
              <div className="col-12 col-xl-6 mxd-grid-item-l no-margin">
                <div className="mxd-block__content content-flex">
                  <div className="mxd-block__manifest">
                    <RevealText
                      as="p"
                      className="mxd-manifest mxd-manifest-l reveal-type"
                    >
                      As a digital illustrator, I&apos;ve always been fascinated
                      by the intersection of art and technology.
                    </RevealText>
                    <div className="mxd-manifest__controls">
                      <AnimatedButton
                        text="About Me"
                        className="btn btn-anim btn-default btn-outline slide-right-up anim-uni-in-up"
                        href={`/about-me`}
                      >
                        <i className="ph-bold ph-arrow-up-right" />
                      </AnimatedButton>
                    </div>
                  </div>
                  <div className="mxd-block__decoration anim-uni-in-up">
                    <Image
                      alt="Decoration"
                      src="/img/icons/96x96-decor-01.svg"
                      width={96}
                      height={96}
                    />
                  </div>
                  {/* Awards section removed */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - About Description with Manifest End */}
      </div>
    </div>
  );
}
