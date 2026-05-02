import Image from "next/image";
import { Link } from "@/i18n/routing";

import VelocityMarquee from "@/components/animation/VelocityMarquee";
import AnimateRotation from "@/components/animation/AnimateRotation";
import { projectsAll } from "@/data/projects.json";

export default function ProjectsMarqueeSlider() {
  return (
    <div className="mxd-section padding-pre-title">
      <div className="mxd-container fullwidth-container">
        <div className="mxd-container__circle circle-fit loading__fade">
          <a
            className="btn-rotating btn-rotating-180 btn-rotating-blur-outline ver-03"
            href="#"
          >
            {/* SVG rotating text */}
            <AnimateRotation
              as="svg"
              version="1.1"
              id="scrollDown"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 160 160"
              enableBackground={"new 0 0 160 160"}
              xmlSpace="preserve"
              className="btn-rotating__text animate-rotation"
              value={360}
            >
              <defs>
                <path
                  id="textPath"
                  d="M149.7,80c0,38.5-31.2,69.7-69.7,69.7S10.3,118.5,10.3,80S41.5,10.3,80,10.3S149.7,41.5,149.7,80z"
                />
              </defs>
              <g>
                <use xlinkHref="#textPath" fill="none" />
                <text>
                  {/* button text here!!! */}
                  <textPath xlinkHref="#textPath">
                    Download CV * Download CV * Download CV *
                  </textPath>
                </text>
              </g>
            </AnimateRotation>
            {/* image */}
            <Image
              className="btn-rotating__image"
              alt=""
              role="presentation"
              src="/img/icons/300x300_obj-btn-03.webp"
              width={300}
              height={300}
            />
          </a>
        </div>
        {/* Block - Marquee Projects Links One Line Start */}
        <div className="mxd-block loading__fade">
          {/* Marquee Divider Start */}
          <VelocityMarquee className="marquee marquee-right--gsap">
            {projectsAll.map((item) => (
              <div
                key={item.id}
                className="marquee__item one-line item-large image"
              >
                <Link
                  className="marquee__link"
                  href={`/projects/${item.slug}`}
                >
                  <Image
                    alt={`${item.title} — 107 Studio`}
                    src={item.image}
                    width={1400}
                    height={1080}
                  />
                </Link>
              </div>
            ))}
          </VelocityMarquee>
        </div>
        {/* Block - Marquee Projects Links One Line End */}
      </div>
    </div>
  );
}
