import footerNav from "@/data/footer-nav.json";
import AnimatedButton from "../animation/AnimatedButton";
import FooterContactForm from "./FooterContactForm";

export default function Footer2({ text = "107 studio" }: { text?: string }) {
  return (
    <footer id="mxd-footer" className="mxd-footer">
      {/* Footer Block - Fullwidth Text Start */}
      <div className="mxd-footer__text-wrap">
        <div className="fullwidth-text__tl-trigger" />
        <div className="mxd-footer__fullwidth-text anim-top-to-bottom">
          <h2
            className="mxd-footer__wordmark"
            style={{
              margin: 0,
              width: "100%",
              textAlign: "center",
              textTransform: "lowercase",
              fontSize: "clamp(3.8rem, 14vw, 16rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              fontWeight: 700,
            }}
          >
            {text}
          </h2>
        </div>
      </div>
      {/* Footer Block - Fullwidth Text End */}
      {/* Footer Block - Info Columns Start */}
      <div className="mxd-footer__footer-blocks">
        {/* single column */}
        <div className="footer-blocks__column animate-card-3">
          {/* inner card */}
          <div className="footer-blocks__card fullheight-card">
            {/* footer navigation */}
            <div className="footer-blocks__nav">
              <ul className="footer-nav">
                {footerNav.map(
                  (
                    item: { label: string; href: string; counter?: number },
                    idx: number
                  ) => (
                    <li className="footer-nav__item anim-uni-in-up" key={idx}>
                      <AnimatedButton
                        href={item.href}
                        text={item.label}
                        className="footer-nav__link btn-anim"
                      />

                      {item.counter && (
                        <p className="footer-nav__counter">
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="20px"
                            height="20px"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill="currentColor"
                              d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2
                  c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4
                  c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2
                  c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6
                  c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4
                  c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6
                  c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"
                            />
                          </svg>
                          <span>{item.counter}</span>
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
            {/* links */}
            <div className="footer-blocks__links anim-uni-in-up">
              <AnimatedButton
                text="Privacy Policy"
                as={"a"}
                className="btn btn-line-xsmall btn-muted slide-right anim-no-delay"
                href="/privacy-policy"
              >
                <i className="ph ph-arrow-right" />
              </AnimatedButton>
              <AnimatedButton
                text="Terms &amp; conditions"
                as={"a"}
                className="btn btn-line-xsmall btn-muted slide-right anim-no-delay"
                href="/terms"
              >
                <i className="ph ph-arrow-right" />
              </AnimatedButton>
            </div>
          </div>
        </div>
        <div className="footer-blocks__column animate-card-3">
          <div className="footer-blocks__card fullheight-card">
            <div className="footer-blocks__block">
              <div className="footer-blocks__title anim-uni-in-up">
                <p className="footer-blocks__title-l">Contact</p>
              </div>
              <p className="t-small t-muted anim-uni-in-up">
                Share your project and we&apos;ll reply soon.
              </p>
            </div>
            <FooterContactForm />
          </div>
        </div>
      </div>
      {/* Footer Block - Info Columns End */}
    </footer>
  );
}
